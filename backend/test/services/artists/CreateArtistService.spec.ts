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
import { CreateArtistService } from '../../../src/services/artists/CreateArtistService';
import { FakeEntityManager } from '../../FakeEntityManager';
import { FakePermissionContext } from '../../FakePermissionContext';
import { createUser } from '../../createEntry';
import { testArtistAuditLogEntry } from '../../testAuditLogEntry';

describe('CreateArtistService', () => {
	let em: FakeEntityManager;
	let existingUser: User;
	let userRepo: any;
	let auditLogService: AuditLogService;
	let permissionContext: FakePermissionContext;
	let createArtistService: CreateArtistService;

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

		permissionContext = new FakePermissionContext(existingUser);

		createArtistService = new CreateArtistService(
			permissionContext,
			em as any,
			userRepo as any,
			auditLogService,
		);
	});

	describe('createArtist', () => {
		const testCreateArtist = async ({
			params,
			snapshot,
		}: {
			params: IUpdateArtistBody;
			snapshot: ArtistSnapshot;
		}): Promise<void> => {
			const artistObject = await createArtistService.createArtist(params);

			expect(artistObject.name).toBe(params.name);
			expect(artistObject.artistType).toBe(params.artistType);

			const artist = em.entities.filter(
				(entity) => entity instanceof Artist,
			)[0] as Artist;

			const revision = em.entities.filter(
				(entity) => entity instanceof ArtistRevision,
			)[0] as ArtistRevision;

			expect(revision).toBeInstanceOf(ArtistRevision);
			expect(revision.artist).toBe(artist);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Created);
			expect(JSON.stringify(revision.snapshot)).toBe(
				JSON.stringify(snapshot),
			);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof ArtistAuditLogEntry,
			)[0] as ArtistAuditLogEntry;

			testArtistAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Artist_Create,
				actor: existingUser,
				actorIp: permissionContext.remoteIpAddress,
				oldValue: '',
				newValue: '',
				artist: artist,
			});
		};

		const defaults = {
			name: 'うたよみ',
			artistType: ArtistType.Person,
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

				createArtistService = new CreateArtistService(
					permissionContext,
					em as any,
					userRepo as any,
					auditLogService,
				);

				await expect(
					createArtistService.createArtist(defaults),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('2 changes', async () => {
			await testCreateArtist({
				params: defaults,
				snapshot: {
					name: defaults.name,
					artistType: defaults.artistType,
				},
			});
		});

		test('name is undefined', async () => {
			await expect(
				createArtistService.createArtist({
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					name: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('name is empty', async () => {
			await expect(
				createArtistService.createArtist({
					...defaults,
					name: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('name is too long', async () => {
			await expect(
				createArtistService.createArtist({
					...defaults,
					name: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('artistType is undefined', async () => {
			await expect(
				createArtistService.createArtist({
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					artistType: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('artistType is empty', async () => {
			await expect(
				createArtistService.createArtist({
					...defaults,
					artistType: '' as ArtistType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('artistType is invalid', async () => {
			await expect(
				createArtistService.createArtist({
					...defaults,
					artistType: 'abcdef' as ArtistType,
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});
