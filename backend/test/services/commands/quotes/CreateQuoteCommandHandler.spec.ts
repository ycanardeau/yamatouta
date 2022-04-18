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
import { CreateQuoteCommandHandler } from '../../../../src/services/commands/quotes/CreateQuoteCommandHandler';
import { FakeEntityManager } from '../../../FakeEntityManager';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { createArtist, createUser } from '../../../createEntry';
import { testQuoteAuditLogEntry } from '../../../testAuditLogEntry';

describe('CreateQuoteCommandHandler', () => {
	let em: FakeEntityManager;
	let existingUser: User;
	let userRepo: any;
	let artist: Artist;
	let artistRepo: any;
	let auditLogger: AuditLogger;
	let permissionContext: FakePermissionContext;
	let createQuoteCommandHandler: CreateQuoteCommandHandler;

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

		permissionContext = new FakePermissionContext(existingUser);

		createQuoteCommandHandler = new CreateQuoteCommandHandler(
			permissionContext,
			em as any,
			userRepo as any,
			artistRepo as any,
			auditLogger,
		);
	});

	describe('createQuote', () => {
		const testCreateQuote = async ({
			params,
			snapshot,
		}: {
			params: IUpdateQuoteBody;
			snapshot: QuoteSnapshot;
		}): Promise<void> => {
			const quoteObject = await createQuoteCommandHandler.execute(params);

			expect(quoteObject.text).toBe(params.text);
			expect(quoteObject.quoteType).toBe(params.quoteType);
			expect(quoteObject.locale).toBe(params.locale);
			expect(quoteObject.artist.id).toBe(params.artistId);

			const quote = em.entities.filter(
				(entity) => entity instanceof Quote,
			)[0] as Quote;

			const revision = em.entities.filter(
				(entity) => entity instanceof QuoteRevision,
			)[0] as QuoteRevision;

			expect(revision).toBeInstanceOf(QuoteRevision);
			expect(revision.quote).toBe(quote);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Created);
			expect(JSON.stringify(revision.snapshot)).toBe(
				JSON.stringify(snapshot),
			);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof QuoteAuditLogEntry,
			)[0] as QuoteAuditLogEntry;

			testQuoteAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Quote_Create,
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

				createQuoteCommandHandler = new CreateQuoteCommandHandler(
					permissionContext,
					em as any,
					userRepo as any,
					artistRepo as any,
					auditLogger,
				);

				await expect(
					createQuoteCommandHandler.execute(defaults),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('4 changes', async () => {
			await testCreateQuote({
				params: defaults,
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
				createQuoteCommandHandler.execute({
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					text: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('text is empty', async () => {
			await expect(
				createQuoteCommandHandler.execute({
					...defaults,
					text: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('text is too long', async () => {
			await expect(
				createQuoteCommandHandler.execute({
					...defaults,
					text: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('quoteType is empty', async () => {
			await expect(
				createQuoteCommandHandler.execute({
					...defaults,
					quoteType: '' as QuoteType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('quoteType is invalid', async () => {
			await expect(
				createQuoteCommandHandler.execute({
					...defaults,
					quoteType: 'abcdef' as QuoteType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('artistId is undefined', async () => {
			await expect(
				createQuoteCommandHandler.execute({
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					artistId: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('artistId is invalid', async () => {
			await expect(
				createQuoteCommandHandler.execute({
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					artistId: 'abcdef' as any,
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});
