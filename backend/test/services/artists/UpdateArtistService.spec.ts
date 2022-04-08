import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import { Artist } from '../../../src/entities/Artist';
import { ArtistAuditLogEntry } from '../../../src/entities/AuditLogEntry';
import { ArtistRevision } from '../../../src/entities/Revision';
import { User } from '../../../src/entities/User';
import { ArtistType } from '../../../src/models/ArtistType';
import { AuditedAction } from '../../../src/models/AuditedAction';
import { RevisionEvent } from '../../../src/models/RevisionEvent';
import { ArtistSnapshot } from '../../../src/models/Snapshot';
import { UserGroup } from '../../../src/models/UserGroup';
import { IUpdateArtistBody } from '../../../src/requests/artists/IUpdateArtistBody';
import { AuditLogService } from '../../../src/services/AuditLogService';
import { UpdateArtistService } from '../../../src/services/artists/UpdateArtistService';
import { FakeEntityManager } from '../../FakeEntityManager';
import { FakePermissionContext } from '../../FakePermissionContext';
import { createArtist, createUser } from '../../createEntry';
import { testArtistAuditLogEntry } from '../../testAuditLogEntry';

describe('UpdateArtistService', () => {
	let em: FakeEntityManager;
	let existingUser: User;
	let artist: Artist;
	let userRepo: any;
	let auditLogService: AuditLogService;
	let artistRepo: any;
	let permissionContext: FakePermissionContext;
	let updateArtistService: UpdateArtistService;

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

		updateArtistService = new UpdateArtistService(
			permissionContext,
			em as any,
			userRepo as any,
			auditLogService,
			artistRepo as any,
		);
	});

	describe('updateArtist', () => {
		const testUpdateArtist = async ({
			body,
			snapshot,
		}: {
			body: IUpdateArtistBody;
			snapshot: ArtistSnapshot;
		}): Promise<void> => {
			const artistObject = await updateArtistService.updateArtist(
				artist.id,
				body,
			);

			expect(artistObject.name).toBe(body.name);
			expect(artistObject.artistType).toBe(body.artistType);

			const revision = em.entities.filter(
				(entity) => entity instanceof ArtistRevision,
			)[0] as ArtistRevision;

			expect(revision).toBeInstanceOf(ArtistRevision);
			expect(revision.artist).toBe(artist);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Updated);
			expect(JSON.stringify(revision.snapshot)).toBe(
				JSON.stringify(snapshot),
			);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof ArtistAuditLogEntry,
			)[0] as ArtistAuditLogEntry;

			testArtistAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Artist_Update,
				actor: existingUser,
				actorIp: permissionContext.remoteIpAddress,
				oldValue: '',
				newValue: '',
				artist: artist,
			});
		};

		const defaults = {
			name: 'くみあい',
			artistType: ArtistType.Group,
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

				updateArtistService = new UpdateArtistService(
					permissionContext,
					em as any,
					userRepo as any,
					auditLogService,
					artistRepo as any,
				);

				await expect(
					updateArtistService.updateArtist(artist.id, defaults),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('0 changes', async () => {
			await testUpdateArtist({
				body: {
					name: artist.name,
					artistType: artist.artistType,
				},
				snapshot: {
					name: artist.name,
					artistType: artist.artistType,
				},
			});
		});

		test('1 change', async () => {
			await testUpdateArtist({
				body: {
					...defaults,
					artistType: artist.artistType,
				},
				snapshot: {
					name: defaults.name,
					artistType: artist.artistType,
				},
			});
		});

		test('2 changes', async () => {
			await testUpdateArtist({
				body: defaults,
				snapshot: {
					name: defaults.name,
					artistType: defaults.artistType,
				},
			});
		});

		test('name is undefined', async () => {
			await expect(
				updateArtistService.updateArtist(artist.id, {
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					name: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('name is empty', async () => {
			await expect(
				updateArtistService.updateArtist(artist.id, {
					...defaults,
					name: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('name is too long', async () => {
			await expect(
				updateArtistService.updateArtist(artist.id, {
					...defaults,
					name: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('artistType is empty', async () => {
			await expect(
				updateArtistService.updateArtist(artist.id, {
					...defaults,
					artistType: '' as ArtistType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('artistType is invalid', async () => {
			await expect(
				updateArtistService.updateArtist(artist.id, {
					...defaults,
					artistType: 'abcdef' as ArtistType,
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});