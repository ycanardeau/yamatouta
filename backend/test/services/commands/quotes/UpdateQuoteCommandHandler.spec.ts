import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

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
import { IUpdateQuoteBody } from '../../../../src/requests/quotes/IUpdateQuoteBody';
import { AuditLogger } from '../../../../src/services/AuditLogger';
import { UpdateQuoteCommandHandler } from '../../../../src/services/commands/quotes/UpdateQuoteCommandHandler';
import { FakeEntityManager } from '../../../FakeEntityManager';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { createArtist, createQuote, createUser } from '../../../createEntry';
import { testQuoteAuditLogEntry } from '../../../testAuditLogEntry';

describe('UpdateQuoteCommandHandler', () => {
	let em: FakeEntityManager;
	let existingUser: User;
	let artist: Artist;
	let quote: Quote;
	let userRepo: any;
	let artistRepo: any;
	let auditLogger: AuditLogger;
	let quoteRepo: any;
	let permissionContext: FakePermissionContext;
	let updateQuoteCommandHandler: UpdateQuoteCommandHandler;

	beforeAll(async () => {
		// See https://stackoverflow.com/questions/69924546/unit-testing-mirkoorm-entities.
		await MikroORM.init(undefined, false);
	});

	beforeEach(async () => {
		const existingUsername = 'existing';
		const existingEmail = 'existing@example.com';

		existingUser = await createUser({
			id: 1,
			username: existingUsername,
			email: existingEmail,
			password: 'P@$$w0rd',
			userGroup: UserGroup.Admin,
		});

		artist = createArtist({
			id: 2,
			name: 'うたよみ',
			artistType: ArtistType.Person,
		});

		quote = createQuote({
			id: 3,
			text: 'やまとうた',
			quoteType: QuoteType.Tanka,
			locale: 'ja',
			artist: artist,
		});

		em = new FakeEntityManager();
		userRepo = {
			findOneOrFail: async (): Promise<User> => existingUser,
			findOne: async (where: any): Promise<User> =>
				[existingUser].filter(
					(u) => u.normalizedEmail === where.normalizedEmail,
				)[0],
			persist: (): void => {},
		};
		artistRepo = {
			findOneOrFail: async (): Promise<Artist> => artist,
		};
		auditLogger = new AuditLogger(em as any);
		quoteRepo = {
			findOneOrFail: async (): Promise<Quote> => quote,
		};

		permissionContext = new FakePermissionContext(existingUser);

		updateQuoteCommandHandler = new UpdateQuoteCommandHandler(
			permissionContext,
			em as any,
			userRepo as any,
			artistRepo as any,
			auditLogger,
			quoteRepo as any,
		);
	});

	describe('updateQuote', () => {
		const testUpdateQuote = async ({
			body,
			snapshot,
		}: {
			body: IUpdateQuoteBody;
			snapshot: QuoteSnapshot;
		}): Promise<void> => {
			const quoteObject = await updateQuoteCommandHandler.execute(
				quote.id,
				body,
			);

			expect(quoteObject.text).toBe(body.text);
			expect(quoteObject.quoteType).toBe(body.quoteType);
			expect(quoteObject.locale).toBe(body.locale);
			expect(quoteObject.artist.id).toBe(body.artistId);

			const revision = em.entities.filter(
				(entity) => entity instanceof QuoteRevision,
			)[0] as QuoteRevision;

			expect(revision).toBeInstanceOf(QuoteRevision);
			expect(revision.quote).toBe(quote);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Updated);
			expect(JSON.stringify(revision.snapshot)).toBe(
				JSON.stringify(snapshot),
			);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof QuoteAuditLogEntry,
			)[0] as QuoteAuditLogEntry;

			testQuoteAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Quote_Update,
				actor: existingUser,
				actorIp: permissionContext.remoteIpAddress,
				oldValue: '',
				newValue: '',
				quote: quote,
			});
		};

		const defaults = {
			text: 'やまとうた',
			quoteType: QuoteType.Tanka,
			locale: 'ja',
			artistId: 2,
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

				updateQuoteCommandHandler = new UpdateQuoteCommandHandler(
					permissionContext,
					em as any,
					userRepo as any,
					artistRepo as any,
					auditLogger,
					quoteRepo as any,
				);

				await expect(
					updateQuoteCommandHandler.execute(quote.id, defaults),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('0 changes', async () => {
			await testUpdateQuote({
				body: {
					text: quote.text,
					quoteType: quote.quoteType,
					locale: quote.locale,
					artistId: quote.artist.id,
				},
				snapshot: {
					text: quote.text,
					quoteType: quote.quoteType,
					locale: quote.locale,
					artist: new ObjectRefSnapshot({ entry: artist }),
				},
			});
		});

		test('1 change', async () => {
			await testUpdateQuote({
				body: {
					...defaults,
					quoteType: quote.quoteType,
					locale: quote.locale,
					artistId: quote.artist.id,
				},
				snapshot: {
					text: defaults.text,
					quoteType: quote.quoteType,
					locale: quote.locale,
					artist: new ObjectRefSnapshot({ entry: artist }),
				},
			});
		});

		test('2 changes', async () => {
			await testUpdateQuote({
				body: {
					...defaults,
					locale: quote.locale,
					artistId: quote.artist.id,
				},
				snapshot: {
					text: defaults.text,
					quoteType: defaults.quoteType,
					locale: quote.locale,
					artist: new ObjectRefSnapshot({ entry: artist }),
				},
			});
		});

		test('3 changes', async () => {
			await testUpdateQuote({
				body: {
					...defaults,
					artistId: quote.artist.id,
				},
				snapshot: {
					text: defaults.text,
					quoteType: defaults.quoteType,
					locale: defaults.locale,
					artist: new ObjectRefSnapshot({ entry: artist }),
				},
			});
		});

		test('4 changes', async () => {
			await testUpdateQuote({
				body: defaults,
				snapshot: {
					text: defaults.text,
					quoteType: defaults.quoteType,
					locale: defaults.locale,
					artist: new ObjectRefSnapshot({ entry: artist }),
				},
			});
		});

		test('text is undefined', async () => {
			await expect(
				updateQuoteCommandHandler.execute(quote.id, {
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					text: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('text is empty', async () => {
			await expect(
				updateQuoteCommandHandler.execute(quote.id, {
					...defaults,
					text: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('text is too long', async () => {
			await expect(
				updateQuoteCommandHandler.execute(quote.id, {
					...defaults,
					text: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('quoteType is empty', async () => {
			await expect(
				updateQuoteCommandHandler.execute(quote.id, {
					...defaults,
					quoteType: '' as QuoteType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('quoteType is invalid', async () => {
			await expect(
				updateQuoteCommandHandler.execute(quote.id, {
					...defaults,
					quoteType: 'abcdef' as QuoteType,
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});
