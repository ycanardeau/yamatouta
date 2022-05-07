import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication, UnauthorizedException } from '@nestjs/common';

import {
	DeleteEntryParams,
	DeleteQuoteCommand,
	DeleteQuoteCommandHandler,
} from '../../../../src/database/commands/entries/DeleteEntryCommandHandler';
import { QuoteAuditLogEntry } from '../../../../src/entities/AuditLogEntry';
import { Quote } from '../../../../src/entities/Quote';
import { QuoteRevision } from '../../../../src/entities/Revision';
import { User } from '../../../../src/entities/User';
import { ArtistType } from '../../../../src/models/ArtistType';
import { AuditedAction } from '../../../../src/models/AuditedAction';
import { QuoteType } from '../../../../src/models/QuoteType';
import { RevisionEvent } from '../../../../src/models/RevisionEvent';
import { UserGroup } from '../../../../src/models/UserGroup';
import { PermissionContext } from '../../../../src/services/PermissionContext';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { assertQuoteAuditLogEntry } from '../../../assertAuditLogEntry';
import { createApplication } from '../../../createApplication';
import { createArtist, createQuote, createUser } from '../../../createEntry';

describe('DeleteQuoteCommandHandler', () => {
	let app: INestApplication;
	let em: EntityManager;
	let existingUser: User;
	let quote: Quote;
	let permissionContext: FakePermissionContext;
	let deleteQuoteCommandHandler: DeleteQuoteCommandHandler;

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
		});

		quote = await createQuote(em, {
			text: 'やまとうた',
			quoteType: QuoteType.Tanka,
			locale: 'ja',
			artist: artist,
		});

		permissionContext = new FakePermissionContext(existingUser);

		deleteQuoteCommandHandler = app.get(DeleteQuoteCommandHandler);
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	describe('deleteQuote', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: DeleteEntryParams,
		): Promise<void> => {
			return deleteQuoteCommandHandler.execute(
				new DeleteQuoteCommand(permissionContext, params),
			);
		};

		const testDeleteQuote = async (): Promise<void> => {
			await execute(permissionContext, {
				entryId: quote.id,
			});

			const revision = quote.revisions[0];

			expect(revision).toBeInstanceOf(QuoteRevision);
			expect(revision.quote).toBe(quote);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Deleted);
			expect(revision.snapshot.contentEquals(quote.takeSnapshot())).toBe(
				true,
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
						entryId: quote.id,
					}),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('delete', async () => {
			await testDeleteQuote();
		});
	});
});
