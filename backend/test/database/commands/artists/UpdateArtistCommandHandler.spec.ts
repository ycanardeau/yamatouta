import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import {
	UpdateArtistCommand,
	UpdateArtistCommandHandler,
	UpdateArtistParams,
} from '../../../../src/database/commands/artists/UpdateArtistCommandHandler';
import { Artist } from '../../../../src/entities/Artist';
import { ArtistAuditLogEntry } from '../../../../src/entities/AuditLogEntry';
import { ArtistRevision } from '../../../../src/entities/Revision';
import { User } from '../../../../src/entities/User';
import { ArtistType } from '../../../../src/models/ArtistType';
import { AuditedAction } from '../../../../src/models/AuditedAction';
import { RevisionEvent } from '../../../../src/models/RevisionEvent';
import { ArtistSnapshot } from '../../../../src/models/Snapshot';
import { UserGroup } from '../../../../src/models/UserGroup';
import { AuditLogEntryFactory } from '../../../../src/services/AuditLogEntryFactory';
import { FakeEntityManager } from '../../../FakeEntityManager';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { createArtist, createUser } from '../../../createEntry';
import { testArtistAuditLogEntry } from '../../../testAuditLogEntry';

describe('UpdateArtistCommandHandler', () => {
	let em: FakeEntityManager;
	let existingUser: User;
	let artist: Artist;
	let userRepo: any;
	let auditLogEntryFactory: AuditLogEntryFactory;
	let artistRepo: any;
	let permissionContext: FakePermissionContext;
	let updateArtistCommandHandler: UpdateArtistCommandHandler;
	let defaultParams: UpdateArtistParams;

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
		auditLogEntryFactory = new AuditLogEntryFactory();
		artistRepo = {
			findOneOrFail: async (where: any): Promise<Artist> =>
				[artist].filter((a) => a.id === where.id)[0],
		};

		permissionContext = new FakePermissionContext(existingUser);

		updateArtistCommandHandler = new UpdateArtistCommandHandler(
			em as any,
			userRepo as any,
			auditLogEntryFactory,
			artistRepo as any,
		);

		defaultParams = {
			artistId: artist.id,
			name: 'くみあい',
			artistType: ArtistType.Group,
		};
	});

	describe('updateArtist', () => {
		const testUpdateArtist = async ({
			command,
			snapshot,
		}: {
			command: UpdateArtistCommand;
			snapshot: ArtistSnapshot;
		}): Promise<void> => {
			const artistObject = await updateArtistCommandHandler.execute(
				command,
			);

			expect(artistObject.name).toBe(command.params.name);
			expect(artistObject.artistType).toBe(command.params.artistType);

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
					updateArtistCommandHandler.execute(
						new UpdateArtistCommand(
							permissionContext,
							defaultParams,
						),
					),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('0 changes', async () => {
			await testUpdateArtist({
				command: new UpdateArtistCommand(permissionContext, {
					...defaultParams,
					name: artist.name,
					artistType: artist.artistType,
				}),
				snapshot: {
					name: artist.name,
					artistType: artist.artistType,
				},
			});
		});

		test('1 change', async () => {
			await testUpdateArtist({
				command: new UpdateArtistCommand(permissionContext, {
					...defaultParams,
					artistType: artist.artistType,
				}),
				snapshot: {
					name: defaultParams.name,
					artistType: artist.artistType,
				},
			});
		});

		test('2 changes', async () => {
			await testUpdateArtist({
				command: new UpdateArtistCommand(
					permissionContext,
					defaultParams,
				),
				snapshot: {
					name: defaultParams.name,
					artistType: defaultParams.artistType,
				},
			});
		});

		test('name is undefined', async () => {
			await expect(
				updateArtistCommandHandler.execute(
					new UpdateArtistCommand(permissionContext, {
						...defaultParams,
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						name: undefined!,
					}),
				),
			).rejects.toThrow(BadRequestException);
		});

		test('name is empty', async () => {
			await expect(
				updateArtistCommandHandler.execute(
					new UpdateArtistCommand(permissionContext, {
						...defaultParams,
						name: '',
					}),
				),
			).rejects.toThrow(BadRequestException);
		});

		test('name is too long', async () => {
			await expect(
				updateArtistCommandHandler.execute(
					new UpdateArtistCommand(permissionContext, {
						...defaultParams,
						name: 'い'.repeat(201),
					}),
				),
			).rejects.toThrow(BadRequestException);
		});

		test('artistType is empty', async () => {
			await expect(
				updateArtistCommandHandler.execute(
					new UpdateArtistCommand(permissionContext, {
						...defaultParams,
						artistType: '' as ArtistType,
					}),
				),
			).rejects.toThrow(BadRequestException);
		});

		test('artistType is invalid', async () => {
			await expect(
				updateArtistCommandHandler.execute(
					new UpdateArtistCommand(permissionContext, {
						...defaultParams,
						artistType: 'abcdef' as ArtistType,
					}),
				),
			).rejects.toThrow(BadRequestException);
		});
	});
});
