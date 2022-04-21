import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import {
	UpdateQuoteCommand,
	UpdateQuoteCommandHandler,
	UpdateQuoteParams,
} from '../../../../src/database/commands/quotes/UpdateQuoteCommandHandler';
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
import { AuditLogEntryFactory } from '../../../../src/services/AuditLogEntryFactory';
import { PermissionContext } from '../../../../src/services/PermissionContext';
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
	let auditLogEntryFactory: AuditLogEntryFactory;
	let quoteRepo: any;
	let permissionContext: FakePermissionContext;
	let updateQuoteCommandHandler: UpdateQuoteCommandHandler;
	let defaultParams: UpdateQuoteParams;

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
		auditLogEntryFactory = new AuditLogEntryFactory();
		quoteRepo = {
			findOneOrFail: async (where: any): Promise<Quote> =>
				[quote].filter((q) => q.id === where.id)[0],
		};

		permissionContext = new FakePermissionContext(existingUser);

		updateQuoteCommandHandler = new UpdateQuoteCommandHandler(
			em as any,
			userRepo as any,
			artistRepo as any,
			auditLogEntryFactory,
			quoteRepo as any,
		);

		defaultParams = {
			quoteId: quote.id,
			text: 'やまとうた',
			quoteType: QuoteType.Tanka,
			locale: 'ja',
			artistId: 2,
			webLinks: [],
		};
	});

	describe('updateQuote', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: UpdateQuoteParams,
		): Promise<QuoteObject> => {
			return updateQuoteCommandHandler.execute(
				new UpdateQuoteCommand(permissionContext, params),
			);
		};

		const testUpdateQuote = async ({
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

		test('0 changes', async () => {
			await testUpdateQuote({
				permissionContext,
				params: {
					...defaultParams,
					text: quote.text,
					quoteType: quote.quoteType,
					locale: quote.locale,
					artistId: quote.artist.id,
				},
				snapshot: {
					text: quote.text,
					quoteType: quote.quoteType,
					locale: quote.locale,
					artist: new ObjectRefSnapshot(artist),
					webLinks: [],
				},
			});
		});

		test('1 change', async () => {
			await testUpdateQuote({
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
					artist: new ObjectRefSnapshot(artist),
					webLinks: [],
				},
			});
		});

		test('2 changes', async () => {
			await testUpdateQuote({
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
					artist: new ObjectRefSnapshot(artist),
					webLinks: [],
				},
			});
		});

		test('3 changes', async () => {
			await testUpdateQuote({
				permissionContext,
				params: {
					...defaultParams,
					artistId: quote.artist.id,
				},
				snapshot: {
					text: defaultParams.text,
					quoteType: defaultParams.quoteType,
					locale: defaultParams.locale,
					artist: new ObjectRefSnapshot(artist),
					webLinks: [],
				},
			});
		});

		test('4 changes', async () => {
			await testUpdateQuote({
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
