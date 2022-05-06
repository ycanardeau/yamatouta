import { EntityManager, MikroORM } from '@mikro-orm/core';
import {
	BadRequestException,
	INestApplication,
	UnauthorizedException,
} from '@nestjs/common';

import {
	CreateQuoteCommand,
	CreateQuoteCommandHandler,
} from '../../../../src/database/commands/quotes/CreateQuoteCommandHandler';
import { UpdateQuoteParams } from '../../../../src/database/commands/quotes/UpdateQuoteCommandHandler';
import { QuoteObject } from '../../../../src/dto/quotes/QuoteObject';
import { Artist } from '../../../../src/entities/Artist';
import { QuoteAuditLogEntry } from '../../../../src/entities/AuditLogEntry';
import { Quote } from '../../../../src/entities/Quote';
import { QuoteRevision } from '../../../../src/entities/Revision';
import { User } from '../../../../src/entities/User';
import { ArtistType } from '../../../../src/models/ArtistType';
import { AuditedAction } from '../../../../src/models/AuditedAction';
import { QuoteType } from '../../../../src/models/QuoteType';
import { RevisionEvent } from '../../../../src/models/RevisionEvent';
import {
	ObjectRefSnapshot,
	QuoteSnapshot,
} from '../../../../src/models/Snapshot';
import { UserGroup } from '../../../../src/models/UserGroup';
import { PermissionContext } from '../../../../src/services/PermissionContext';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { assertQuoteAuditLogEntry } from '../../../assertAuditLogEntry';
import { createApplication } from '../../../createApplication';
import { createArtist, createUser } from '../../../createEntry';

describe('CreateQuoteCommandHandler', () => {
	let app: INestApplication;
	let em: EntityManager;
	let existingUser: User;
	let artist: Artist;
	let permissionContext: FakePermissionContext;
	let createQuoteCommandHandler: CreateQuoteCommandHandler;
	let defaultParams: UpdateQuoteParams;

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
		});

		permissionContext = new FakePermissionContext(existingUser);

		createQuoteCommandHandler = app.get(CreateQuoteCommandHandler);

		defaultParams = {
			quoteId: undefined,
			text: 'やまとうた',
			quoteType: QuoteType.Tanka,
			locale: 'ja',
			artistId: 2,
			webLinks: [],
		};
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	describe('createQuote', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: UpdateQuoteParams,
		): Promise<QuoteObject> => {
			return createQuoteCommandHandler.execute(
				new CreateQuoteCommand(permissionContext, params),
			);
		};

		const testCreateQuote = async ({
			permissionContext,
			params,
			snapshot,
		}: {
			permissionContext: PermissionContext;
			params: UpdateQuoteParams;
			snapshot: QuoteSnapshot;
		}): Promise<void> => {
			const quoteObject = await execute(permissionContext, params);

			expect(quoteObject.text).toBe(params.text);
			expect(quoteObject.quoteType).toBe(params.quoteType);
			expect(quoteObject.locale).toBe(params.locale);
			expect(quoteObject.artist.id).toBe(params.artistId);

			const quote = await em.findOneOrFail(Quote, { id: quoteObject.id });

			const revision = quote.revisions[0];

			expect(revision).toBeInstanceOf(QuoteRevision);
			expect(revision.quote).toBe(quote);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Created);
			expect(JSON.stringify(revision.snapshot)).toBe(
				JSON.stringify(snapshot),
			);

			const auditLogEntry = await em.findOneOrFail(QuoteAuditLogEntry, {
				quote: quote,
			});

			assertQuoteAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Quote_Create,
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

		test('4 changes', async () => {
			await testCreateQuote({
				permissionContext,
				params: defaultParams,
				snapshot: {
					text: defaultParams.text,
					quoteType: defaultParams.quoteType,
					locale: defaultParams.locale,
					artist: new ObjectRefSnapshot(artist),
					webLinks: [],
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

		test('artistId is undefined', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					artistId: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('artistId is invalid', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					artistId: 'abcdef' as any,
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
