import { MikroORM } from '@mikro-orm/core';
import { UnauthorizedException } from '@nestjs/common';

import { QuoteAuditLogEntry } from '../../../src/entities/AuditLogEntry';
import { Quote } from '../../../src/entities/Quote';
import { QuoteRevision } from '../../../src/entities/Revision';
import { User } from '../../../src/entities/User';
import { ArtistType } from '../../../src/models/ArtistType';
import { AuditedAction } from '../../../src/models/AuditedAction';
import { QuoteType } from '../../../src/models/QuoteType';
import { RevisionEvent } from '../../../src/models/RevisionEvent';
import { QuoteSnapshot } from '../../../src/models/Snapshot';
import { UserGroup } from '../../../src/models/UserGroup';
import { AuditLogger } from '../../../src/services/AuditLogger';
import { DeleteQuoteService } from '../../../src/services/entries/DeleteEntryService';
import { FakeEntityManager } from '../../FakeEntityManager';
import { FakePermissionContext } from '../../FakePermissionContext';
import { createArtist, createQuote, createUser } from '../../createEntry';
import { testQuoteAuditLogEntry } from '../../testAuditLogEntry';

describe('DeleteQuoteService', () => {
	let em: FakeEntityManager;
	let existingUser: User;
	let quote: Quote;
	let userRepo: any;
	let auditLogger: AuditLogger;
	let quoteRepo: any;
	let permissionContext: FakePermissionContext;
	let deleteQuoteService: DeleteQuoteService;

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

		const artist = createArtist({
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
		auditLogger = new AuditLogger(em as any);
		quoteRepo = {
			findOneOrFail: async (): Promise<Quote> => quote,
		};

		permissionContext = new FakePermissionContext(existingUser);

		deleteQuoteService = new DeleteQuoteService(
			permissionContext,
			em as any,
			userRepo as any,
			auditLogger,
			quoteRepo as any,
		);
	});

	describe('deleteQuote', () => {
		const testDeleteQuote = async (): Promise<void> => {
			await deleteQuoteService.execute(quote.id);

			const revision = em.entities.filter(
				(entity) => entity instanceof QuoteRevision,
			)[0] as QuoteRevision;

			expect(revision).toBeInstanceOf(QuoteRevision);
			expect(revision.quote).toBe(quote);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Deleted);
			expect(JSON.stringify(revision.snapshot)).toBe(
				JSON.stringify(new QuoteSnapshot({ quote: quote })),
			);

			expect(quote.deleted).toBe(true);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof QuoteAuditLogEntry,
			)[0] as QuoteAuditLogEntry;

			testQuoteAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Quote_Delete,
				actor: existingUser,
				actorIp: permissionContext.remoteIpAddress,
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

				deleteQuoteService = new DeleteQuoteService(
					permissionContext,
					em as any,
					userRepo as any,
					auditLogger,
					quoteRepo as any,
				);

				await expect(
					deleteQuoteService.execute(quote.id),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('delete', async () => {
			await testDeleteQuote();
		});
	});
});
