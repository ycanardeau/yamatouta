import { MikroORM } from '@mikro-orm/core';
import { UnauthorizedException } from '@nestjs/common';

import { Artist } from '../../../src/entities/Artist';
import { ArtistAuditLogEntry } from '../../../src/entities/AuditLogEntry';
import { ArtistRevision } from '../../../src/entities/Revision';
import { User } from '../../../src/entities/User';
import { ArtistType } from '../../../src/models/ArtistType';
import { AuditedAction } from '../../../src/models/AuditedAction';
import { RevisionEvent } from '../../../src/models/RevisionEvent';
import { ArtistSnapshot } from '../../../src/models/Snapshot';
import { UserGroup } from '../../../src/models/UserGroup';
import { AuditLogService } from '../../../src/services/AuditLogService';
import { DeleteArtistService } from '../../../src/services/entries/DeleteEntryService';
import { FakeEntityManager } from '../../FakeEntityManager';
import { FakePermissionContext } from '../../FakePermissionContext';
import { createArtist, createUser } from '../../createEntry';
import { testArtistAuditLogEntry } from '../../testAuditLogEntry';

describe('DeleteArtistService', () => {
	let em: FakeEntityManager;
	let existingUser: User;
	let artist: Artist;
	let userRepo: any;
	let auditLogService: AuditLogService;
	let artistRepo: any;
	let permissionContext: FakePermissionContext;
	let deleteArtistService: DeleteArtistService;

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
		auditLogService = new AuditLogService(em as any);
		artistRepo = {
			findOneOrFail: async (): Promise<Artist> => artist,
		};

		permissionContext = new FakePermissionContext(existingUser);

		deleteArtistService = new DeleteArtistService(
			permissionContext,
			em as any,
			userRepo as any,
			auditLogService,
			artistRepo as any,
		);
	});

	describe('deleteArtist', () => {
		const testDeleteArtist = async (): Promise<void> => {
			await deleteArtistService.deleteEntry(artist.id);

			const revision = em.entities.filter(
				(entity) => entity instanceof ArtistRevision,
			)[0] as ArtistRevision;

			expect(revision).toBeInstanceOf(ArtistRevision);
			expect(revision.artist).toBe(artist);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Deleted);
			expect(JSON.stringify(revision.snapshot)).toBe(
				JSON.stringify(new ArtistSnapshot({ artist: artist })),
			);

			expect(artist.deleted).toBe(true);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof ArtistAuditLogEntry,
			)[0] as ArtistAuditLogEntry;

			testArtistAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Artist_Delete,
				actor: existingUser,
				actorIp: permissionContext.remoteIpAddress,
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

				deleteArtistService = new DeleteArtistService(
					permissionContext,
					em as any,
					userRepo as any,
					auditLogService,
					artistRepo as any,
				);

				await expect(
					deleteArtistService.deleteEntry(artist.id),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('delete', async () => {
			await testDeleteArtist();
		});
	});
});
