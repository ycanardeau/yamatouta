import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication, NotFoundException } from '@nestjs/common';

import { ArtistObject } from '../../src/dto/ArtistObject';
import { Artist } from '../../src/entities/Artist';
import { ArtistType } from '../../src/models/artists/ArtistType';
import { PermissionContext } from '../../src/services/PermissionContext';
import { FakePermissionContext } from '../FakePermissionContext';
import { createApplication } from '../createApplication';
import { createArtist, createUser } from '../createEntry';

describe('ArtistObject', () => {
	let app: INestApplication;
	let em: EntityManager;
	let artist: Artist;
	let deletedArtist: Artist;
	let hiddenArtist: Artist;
	let permissionContext: PermissionContext;

	beforeAll(async () => {
		app = await createApplication();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(async () => {
		em = app.get(EntityManager);

		const user = await createUser(em as any, {
			username: 'user',
			email: 'user@example.com',
		});

		artist = await createArtist(em as any, {
			name: 'artist',
			artistType: ArtistType.Person,
			actor: user,
		});

		deletedArtist = await createArtist(em as any, {
			name: 'deleted',
			artistType: ArtistType.Person,
			actor: user,
			deleted: true,
		});

		hiddenArtist = await createArtist(em as any, {
			name: 'hidden',
			artistType: ArtistType.Person,
			actor: user,
			hidden: true,
		});

		const viewer = await createUser(em as any, {
			username: 'viewer',
			email: 'viewer@example.com',
		});

		permissionContext = new FakePermissionContext(viewer);
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	test('create', () => {
		const artistObject = ArtistObject.create(permissionContext, artist);
		expect(artistObject.id).toBe(artist.id);
		expect(artistObject.name).toBe(artist.name);
		expect(artistObject.artistType).toBe(artist.artistType);

		expect(() =>
			ArtistObject.create(permissionContext, deletedArtist),
		).toThrow(NotFoundException);

		expect(() =>
			ArtistObject.create(permissionContext, hiddenArtist),
		).toThrow(NotFoundException);
	});
});
