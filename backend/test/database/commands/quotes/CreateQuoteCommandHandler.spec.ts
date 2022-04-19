import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import { CreateQuoteCommandHandler } from '../../../../src/database/commands/quotes/CreateQuoteCommandHandler';
import { UpdateQuoteCommand } from '../../../../src/database/commands/quotes/UpdateQuoteCommandHandler';
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
import { AuditLogger } from '../../../../src/services/AuditLogger';
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
	let defaultCommand: UpdateQuoteCommand;

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

		defaultCommand = {
			quoteId: undefined,
			text: 'やまとうた',
			quoteType: QuoteType.Tanka,
			locale: 'ja',
			artistId: 2,
		};
	});

	describe('createQuote', () => {
		const testCreateQuote = async ({
			command,
			snapshot,
		}: {
			command: UpdateQuoteCommand;
			snapshot: QuoteSnapshot;
		}): Promise<void> => {
			const quoteObject = await createQuoteCommandHandler.execute(
				command,
			);

			expect(quoteObject.text).toBe(command.text);
			expect(quoteObject.quoteType).toBe(command.quoteType);
			expect(quoteObject.locale).toBe(command.locale);
			expect(quoteObject.artist.id).toBe(command.artistId);

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

				createQuoteCommandHandler = new CreateQuoteCommandHandler(
					permissionContext,
					em as any,
					userRepo as any,
					artistRepo as any,
					auditLogger,
				);

				await expect(
					createQuoteCommandHandler.execute(defaultCommand),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('4 changes', async () => {
			await testCreateQuote({
				command: defaultCommand,
				snapshot: {
					text: defaultCommand.text,
					quoteType: defaultCommand.quoteType,
					locale: defaultCommand.locale,
					artist: new ObjectRefSnapshot({ entry: artist }),
				},
			});
		});

		test('text is undefined', async () => {
			await expect(
				createQuoteCommandHandler.execute({
					...defaultCommand,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					text: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('text is empty', async () => {
			await expect(
				createQuoteCommandHandler.execute({
					...defaultCommand,
					text: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('text is too long', async () => {
			await expect(
				createQuoteCommandHandler.execute({
					...defaultCommand,
					text: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('quoteType is empty', async () => {
			await expect(
				createQuoteCommandHandler.execute({
					...defaultCommand,
					quoteType: '' as QuoteType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('quoteType is invalid', async () => {
			await expect(
				createQuoteCommandHandler.execute({
					...defaultCommand,
					quoteType: 'abcdef' as QuoteType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('artistId is undefined', async () => {
			await expect(
				createQuoteCommandHandler.execute({
					...defaultCommand,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					artistId: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('artistId is invalid', async () => {
			await expect(
				createQuoteCommandHandler.execute({
					...defaultCommand,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					artistId: 'abcdef' as any,
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});
