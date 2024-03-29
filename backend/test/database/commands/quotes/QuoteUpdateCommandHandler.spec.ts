import {
	QuoteUpdateCommand,
	QuoteUpdateCommandHandler,
} from '@/database/commands/quotes/QuoteUpdateCommandHandler';
import { QuoteDto } from '@/dto/QuoteDto';
import { Artist } from '@/entities/Artist';
import { QuoteAuditLogEntry } from '@/entities/AuditLogEntry';
import { Quote } from '@/entities/Quote';
import { QuoteRevision } from '@/entities/Revision';
import { User } from '@/entities/User';
import { AuditedAction } from '@/models/AuditedAction';
import { RevisionEvent } from '@/models/RevisionEvent';
import { ArtistType } from '@/models/artists/ArtistType';
import { QuoteType } from '@/models/quotes/QuoteType';
import { QuoteUpdateParams } from '@/models/quotes/QuoteUpdateParams';
import { ObjectRefSnapshot } from '@/models/snapshots/ObjectRefSnapshot';
import { IQuoteSnapshot } from '@/models/snapshots/QuoteSnapshot';
import { UserGroup } from '@/models/users/UserGroup';
import { NgramConverter } from '@/services/NgramConverter';
import { PermissionContext } from '@/services/PermissionContext';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import {
	BadRequestException,
	INestApplication,
	UnauthorizedException,
} from '@nestjs/common';
import { FakePermissionContext } from 'test/FakePermissionContext';
import { assertQuoteAuditLogEntry } from 'test/assertAuditLogEntry';
import { createApplication } from 'test/createApplication';
import { createArtist, createQuote, createUser } from 'test/createEntry';

describe('QuoteUpdateCommandHandler', () => {
	let app: INestApplication;
	let em: EntityManager;
	let existingUser: User;
	let artist: Artist;
	let quote: Quote;
	let permissionContext: FakePermissionContext;
	let quoteUpdateCommandHandler: QuoteUpdateCommandHandler;
	let defaultParams: QuoteUpdateParams;

	beforeAll(async () => {
		app = await createApplication();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(async () => {
		em = app.get(EntityManager);

		existingUser = await createUser(em, {
			username: 'existing',
			email: 'existing@example.com',
			password: 'P@$$w0rd',
			userGroup: UserGroup.Admin,
		});

		artist = await createArtist(em, {
			name: 'うたよみ',
			artistType: ArtistType.Person,
			actor: existingUser,
		});

		quote = await createQuote(em, {
			text: 'みじかうた',
			quoteType: QuoteType.Tanka,
			locale: 'ja',
			artist: artist,
			actor: existingUser,
		});

		permissionContext = new FakePermissionContext(existingUser);

		quoteUpdateCommandHandler = app.get(QuoteUpdateCommandHandler);

		defaultParams = {
			id: quote.id,
			text: 'うたことば',
			quoteType: QuoteType.Lyrics,
			locale: 'ojp',
			artistId: artist.id,
			webLinks: [],
			workLinks: [],
		};
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	describe('quoteUpdate', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: QuoteUpdateParams,
		): Promise<QuoteDto> => {
			return quoteUpdateCommandHandler.execute(
				new QuoteUpdateCommand(permissionContext, params),
			);
		};

		const testQuoteUpdate = async ({
			permissionContext,
			params,
			snapshot,
		}: {
			permissionContext: PermissionContext;
			params: QuoteUpdateParams;
			snapshot: IQuoteSnapshot;
		}): Promise<void> => {
			const quoteDto = await execute(permissionContext, params);

			expect(quoteDto.text).toBe(params.text);
			expect(quoteDto.quoteType).toBe(params.quoteType);
			expect(quoteDto.locale).toBe(params.locale);
			expect(quoteDto.artist.id).toBe(params.artistId);

			const quote = await em.findOneOrFail(Quote, { id: quoteDto.id });

			const ngramConverter = app.get(NgramConverter);
			const searchIndex = quote.searchIndex.getEntity();
			expect(searchIndex.text).toBe(
				ngramConverter.toFullText(
					[params.text, quote /* TODO */.transcription].join(' '),
					2,
				),
			);

			const revision = quote.revisions[1];

			expect(revision).toBeInstanceOf(QuoteRevision);
			expect(revision.quote.getEntity()).toBe(quote);
			expect(revision.actor.getEntity()).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Updated);
			expect(revision.snapshot).toBe(JSON.stringify(snapshot));

			const auditLogEntry = await em.findOneOrFail(QuoteAuditLogEntry, {
				quote: quote,
			});

			assertQuoteAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Quote_Update,
				actor: existingUser,
				actorIp: permissionContext.clientIp,
				oldValue: '',
				newValue: '',
				quote: quote,
			});
		};

		test('insufficient permission', async () => {
			const userGroups = Object.values(UserGroup).filter(
				(userGroup) => userGroup !== UserGroup.Admin,
			);

			for (const userGroup of userGroups) {
				existingUser.userGroup = userGroup;

				const permissionContext = new FakePermissionContext(
					existingUser,
				);

				await expect(
					execute(permissionContext, defaultParams),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('nothing has changed', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					text: quote.text,
					quoteType: quote.quoteType,
					locale: quote.locale,
					artistId: quote.artist.id,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('1 change', async () => {
			await testQuoteUpdate({
				permissionContext,
				params: {
					...defaultParams,
					quoteType: quote.quoteType,
					locale: quote.locale,
					artistId: quote.artist.id,
				},
				snapshot: {
					text: defaultParams.text,
					quoteType: quote.quoteType,
					locale: quote.locale,
					artist: ObjectRefSnapshot.create(artist),
					webLinks: [],
					workLinks: [],
					transcription: '',
					foreword: '',
					customArtistName: '',
					hashtagLinks: [],
				},
			});
		});

		test('2 changes', async () => {
			await testQuoteUpdate({
				permissionContext,
				params: {
					...defaultParams,
					locale: quote.locale,
					artistId: quote.artist.id,
				},
				snapshot: {
					text: defaultParams.text,
					quoteType: defaultParams.quoteType,
					locale: quote.locale,
					artist: ObjectRefSnapshot.create(artist),
					webLinks: [],
					workLinks: [],
					transcription: '',
					foreword: '',
					customArtistName: '',
					hashtagLinks: [],
				},
			});
		});

		test('3 changes', async () => {
			await testQuoteUpdate({
				permissionContext,
				params: {
					...defaultParams,
					artistId: quote.artist.id,
				},
				snapshot: {
					text: defaultParams.text,
					quoteType: defaultParams.quoteType,
					locale: defaultParams.locale,
					artist: ObjectRefSnapshot.create(artist),
					webLinks: [],
					workLinks: [],
					transcription: '',
					foreword: '',
					customArtistName: '',
					hashtagLinks: [],
				},
			});
		});

		test('4 changes', async () => {
			await testQuoteUpdate({
				permissionContext,
				params: defaultParams,
				snapshot: {
					text: defaultParams.text,
					quoteType: defaultParams.quoteType,
					locale: defaultParams.locale,
					artist: ObjectRefSnapshot.create(artist),
					webLinks: [],
					workLinks: [],
					transcription: '',
					foreword: '',
					customArtistName: '',
					hashtagLinks: [],
				},
			});
		});

		test('text is undefined', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					text: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('text is empty', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					text: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('text is too long', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					text: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('quoteType is empty', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					quoteType: '' as QuoteType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('quoteType is invalid', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					quoteType: 'abcdef' as QuoteType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('webLinks is undefined', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					webLinks: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});
