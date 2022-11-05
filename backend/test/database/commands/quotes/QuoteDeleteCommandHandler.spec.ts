import {
	QuoteDeleteCommand,
	QuoteDeleteCommandHandler,
} from '@/database/commands/EntryDeleteCommandHandler';
import { QuoteAuditLogEntry } from '@/entities/AuditLogEntry';
import { Quote } from '@/entities/Quote';
import { QuoteRevision } from '@/entities/Revision';
import { User } from '@/entities/User';
import { AuditedAction } from '@/models/AuditedAction';
import { EntryDeleteParams } from '@/models/EntryDeleteParams';
import { RevisionEvent } from '@/models/RevisionEvent';
import { ArtistType } from '@/models/artists/ArtistType';
import { QuoteType } from '@/models/quotes/QuoteType';
import { UserGroup } from '@/models/users/UserGroup';
import { PermissionContext } from '@/services/PermissionContext';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { FakePermissionContext } from 'test/FakePermissionContext';
import { assertQuoteAuditLogEntry } from 'test/assertAuditLogEntry';
import { createApplication } from 'test/createApplication';
import { createArtist, createQuote, createUser } from 'test/createEntry';

describe('QuoteDeleteCommandHandler', () => {
	let app: INestApplication;
	let em: EntityManager;
	let existingUser: User;
	let quote: Quote;
	let permissionContext: FakePermissionContext;
	let quoteDeleteCommandHandler: QuoteDeleteCommandHandler;

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

		const artist = await createArtist(em, {
			name: 'うたよみ',
			artistType: ArtistType.Person,
			actor: existingUser,
		});

		quote = await createQuote(em, {
			text: 'やまとうた',
			quoteType: QuoteType.Tanka,
			locale: 'ja',
			artist: artist,
			actor: existingUser,
		});

		permissionContext = new FakePermissionContext(existingUser);

		quoteDeleteCommandHandler = app.get(QuoteDeleteCommandHandler);
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	describe('quoteDelete', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: EntryDeleteParams,
		): Promise<void> => {
			return quoteDeleteCommandHandler.execute(
				new QuoteDeleteCommand(permissionContext, params),
			);
		};

		const testQuoteDelete = async (): Promise<void> => {
			await execute(permissionContext, {
				id: quote.id,
			});

			const revision = quote.revisions[1];

			expect(revision).toBeInstanceOf(QuoteRevision);
			expect(revision.quote.getEntity()).toBe(quote);
			expect(revision.actor.getEntity()).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Deleted);
			expect(revision.snapshot).toBe(
				JSON.stringify(quote.takeSnapshot()),
			);

			expect(quote.deleted).toBe(true);

			const auditLogEntry = await em.findOneOrFail(QuoteAuditLogEntry, {
				quote: quote,
			});

			assertQuoteAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Quote_Delete,
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
					execute(permissionContext, {
						id: quote.id,
					}),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('delete', async () => {
			await testQuoteDelete();
		});
	});
});
