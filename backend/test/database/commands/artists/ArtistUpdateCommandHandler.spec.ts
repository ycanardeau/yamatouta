import {
	ArtistUpdateCommand,
	ArtistUpdateCommandHandler,
} from '@/database/commands/artists/ArtistUpdateCommandHandler';
import { ArtistDto } from '@/dto/ArtistDto';
import { Artist } from '@/entities/Artist';
import { ArtistAuditLogEntry } from '@/entities/AuditLogEntry';
import { ArtistRevision } from '@/entities/Revision';
import { User } from '@/entities/User';
import { AuditedAction } from '@/models/AuditedAction';
import { RevisionEvent } from '@/models/RevisionEvent';
import { ArtistType } from '@/models/artists/ArtistType';
import { ArtistUpdateParams } from '@/models/artists/ArtistUpdateParams';
import { IArtistSnapshot } from '@/models/snapshots/ArtistSnapshot';
import { UserGroup } from '@/models/users/UserGroup';
import { NgramConverter } from '@/services/NgramConverter';
import { PermissionContext } from '@/services/PermissionContext';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import {
	BadRequestException,
	INestApplication,
	UnauthorizedException,
} from '@nestjs/common';
import { FakePermissionContext } from 'test/FakePermissionContext';
import { assertArtistAuditLogEntry } from 'test/assertAuditLogEntry';
import { createApplication } from 'test/createApplication';
import { createArtist, createUser } from 'test/createEntry';

describe('ArtistUpdateCommandHandler', () => {
	let app: INestApplication;
	let em: EntityManager;
	let existingUser: User;
	let artist: Artist;
	let permissionContext: FakePermissionContext;
	let artistUpdateCommandHandler: ArtistUpdateCommandHandler;
	let defaultParams: ArtistUpdateParams;

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

		artistUpdateCommandHandler = app.get(ArtistUpdateCommandHandler);

		defaultParams = {
			id: artist.id,
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

	describe('artistUpdate', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: ArtistUpdateParams,
		): Promise<ArtistDto> => {
			return artistUpdateCommandHandler.execute(
				new ArtistUpdateCommand(permissionContext, params),
			);
		};

		const testArtistUpdate = async ({
			permissionContext,
			params,
			snapshot,
		}: {
			permissionContext: PermissionContext;
			params: ArtistUpdateParams;
			snapshot: IArtistSnapshot;
		}): Promise<void> => {
			const artistDto = await execute(permissionContext, params);

			expect(artistDto.name).toBe(params.name);
			expect(artistDto.artistType).toBe(params.artistType);

			const artist = await em.findOneOrFail(Artist, {
				id: artistDto.id,
			});

			const ngramConverter = app.get(NgramConverter);
			const searchIndex = artist.searchIndex.getEntity();
			expect(searchIndex.name).toBe(
				ngramConverter.toFullText(params.name, 2),
			);

			const revision = artist.revisions[1];

			expect(revision).toBeInstanceOf(ArtistRevision);
			expect(revision.artist.getEntity()).toBe(artist);
			expect(revision.actor.getEntity()).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Updated);
			expect(revision.snapshot).toBe(JSON.stringify(snapshot));

			const auditLogEntry = await em.findOneOrFail(ArtistAuditLogEntry, {
				artist: artist,
			});

			assertArtistAuditLogEntry(auditLogEntry, {
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

		test('nothing has changed', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					name: artist.name,
					artistType: artist.artistType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('1 change', async () => {
			await testArtistUpdate({
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
			await testArtistUpdate({
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
