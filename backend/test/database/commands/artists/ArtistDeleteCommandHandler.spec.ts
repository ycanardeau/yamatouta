import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication, UnauthorizedException } from '@nestjs/common';

import {
	ArtistDeleteCommand,
	ArtistDeleteCommandHandler,
} from '../../../../src/database/commands/EntryDeleteCommandHandler';
import { Artist } from '../../../../src/entities/Artist';
import { ArtistAuditLogEntry } from '../../../../src/entities/AuditLogEntry';
import { ArtistRevision } from '../../../../src/entities/Revision';
import { User } from '../../../../src/entities/User';
import { AuditedAction } from '../../../../src/models/AuditedAction';
import { EntryDeleteParams } from '../../../../src/models/EntryDeleteParams';
import { RevisionEvent } from '../../../../src/models/RevisionEvent';
import { ArtistType } from '../../../../src/models/artists/ArtistType';
import { UserGroup } from '../../../../src/models/users/UserGroup';
import { PermissionContext } from '../../../../src/services/PermissionContext';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { assertArtistAuditLogEntry } from '../../../assertAuditLogEntry';
import { createApplication } from '../../../createApplication';
import { createArtist, createUser } from '../../../createEntry';

describe('ArtistDeleteCommandHandler', () => {
	let app: INestApplication;
	let em: EntityManager;
	let existingUser: User;
	let artist: Artist;
	let permissionContext: FakePermissionContext;
	let artistDeleteCommandHandler: ArtistDeleteCommandHandler;

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

		permissionContext = new FakePermissionContext(existingUser);

		artistDeleteCommandHandler = app.get(ArtistDeleteCommandHandler);
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	describe('artistDelete', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: EntryDeleteParams,
		): Promise<void> => {
			return artistDeleteCommandHandler.execute(
				new ArtistDeleteCommand(permissionContext, params),
			);
		};

		const testArtistDelete = async (): Promise<void> => {
			await execute(permissionContext, {
				id: artist.id,
			});

			const revision = artist.revisions[1];

			expect(revision).toBeInstanceOf(ArtistRevision);
			expect(revision.artist.getEntity()).toBe(artist);
			expect(revision.actor.getEntity()).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Deleted);
			expect(revision.snapshot).toBe(
				JSON.stringify(artist.takeSnapshot()),
			);

			expect(artist.deleted).toBe(true);

			const auditLogEntry = await em.findOneOrFail(ArtistAuditLogEntry, {
				artist: artist,
			});

			assertArtistAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Artist_Delete,
				actor: existingUser,
				actorIp: permissionContext.clientIp,
				oldValue: '',
				newValue: '',
				artist: artist,
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
						id: artist.id,
					}),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('delete', async () => {
			await testArtistDelete();
		});
	});
});
