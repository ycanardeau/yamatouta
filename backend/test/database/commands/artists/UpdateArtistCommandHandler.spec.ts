import { EntityManager, MikroORM } from '@mikro-orm/core';
import {
	BadRequestException,
	INestApplication,
	UnauthorizedException,
} from '@nestjs/common';

import {
	UpdateArtistCommand,
	UpdateArtistCommandHandler,
	UpdateArtistParams,
} from '../../../../src/database/commands/artists/UpdateArtistCommandHandler';
import { ArtistObject } from '../../../../src/dto/artists/ArtistObject';
import { Artist } from '../../../../src/entities/Artist';
import { ArtistAuditLogEntry } from '../../../../src/entities/AuditLogEntry';
import { ArtistRevision } from '../../../../src/entities/Revision';
import { User } from '../../../../src/entities/User';
import { ArtistType } from '../../../../src/models/ArtistType';
import { AuditedAction } from '../../../../src/models/AuditedAction';
import { RevisionEvent } from '../../../../src/models/RevisionEvent';
import { ArtistSnapshot } from '../../../../src/models/Snapshot';
import { UserGroup } from '../../../../src/models/UserGroup';
import { PermissionContext } from '../../../../src/services/PermissionContext';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { createApplication } from '../../../createApplication';
import { createArtist, createUser } from '../../../createEntry';
import { testArtistAuditLogEntry } from '../../../testAuditLogEntry';

describe('UpdateArtistCommandHandler', () => {
	let app: INestApplication;
	let em: EntityManager;
	let existingUser: User;
	let artist: Artist;
	let permissionContext: FakePermissionContext;
	let updateArtistCommandHandler: UpdateArtistCommandHandler;
	let defaultParams: UpdateArtistParams;

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
		});

		permissionContext = new FakePermissionContext(existingUser);

		updateArtistCommandHandler = app.get(UpdateArtistCommandHandler);

		defaultParams = {
			artistId: artist.id,
			name: 'くみあい',
			artistType: ArtistType.Group,
			webLinks: [],
		};
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	describe('updateArtist', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: UpdateArtistParams,
		): Promise<ArtistObject> => {
			return updateArtistCommandHandler.execute(
				new UpdateArtistCommand(permissionContext, params),
			);
		};

		const testUpdateArtist = async ({
			permissionContext,
			params,
			snapshot,
		}: {
			permissionContext: PermissionContext;
			params: UpdateArtistParams;
			snapshot: ArtistSnapshot;
		}): Promise<void> => {
			const artistObject = await execute(permissionContext, params);

			expect(artistObject.name).toBe(params.name);
			expect(artistObject.artistType).toBe(params.artistType);

			const artist = await em.findOneOrFail(Artist, {
				id: artistObject.id,
			});

			const revision = artist.revisions[0];

			expect(revision).toBeInstanceOf(ArtistRevision);
			expect(revision.artist).toBe(artist);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Updated);
			expect(JSON.stringify(revision.snapshot)).toBe(
				JSON.stringify(snapshot),
			);

			const auditLogEntry = await em.findOneOrFail(ArtistAuditLogEntry, {
				artist: artist,
			});

			testArtistAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Artist_Update,
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
					execute(permissionContext, defaultParams),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('0 changes', async () => {
			await testUpdateArtist({
				permissionContext,
				params: {
					...defaultParams,
					name: artist.name,
					artistType: artist.artistType,
				},
				snapshot: {
					name: artist.name,
					artistType: artist.artistType,
					webLinks: [],
				},
			});
		});

		test('1 change', async () => {
			await testUpdateArtist({
				permissionContext,
				params: {
					...defaultParams,
					artistType: artist.artistType,
				},
				snapshot: {
					name: defaultParams.name,
					artistType: artist.artistType,
					webLinks: [],
				},
			});
		});

		test('2 changes', async () => {
			await testUpdateArtist({
				permissionContext,
				params: defaultParams,
				snapshot: {
					name: defaultParams.name,
					artistType: defaultParams.artistType,
					webLinks: [],
				},
			});
		});

		test('name is undefined', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					name: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('name is empty', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					name: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('name is too long', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					name: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('artistType is empty', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					artistType: '' as ArtistType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('artistType is invalid', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					artistType: 'abcdef' as ArtistType,
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
