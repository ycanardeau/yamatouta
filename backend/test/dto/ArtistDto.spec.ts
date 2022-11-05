import { ArtistDto } from '@/dto/ArtistDto';
import { Artist } from '@/entities/Artist';
import { ArtistType } from '@/models/artists/ArtistType';
import { PermissionContext } from '@/services/PermissionContext';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { FakePermissionContext } from 'test/FakePermissionContext';
import { createApplication } from 'test/createApplication';
import { createArtist, createUser } from 'test/createEntry';

describe('ArtistDto', () => {
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
		const artistDto = ArtistDto.create(permissionContext, artist);
		expect(artistDto.id).toBe(artist.id);
		expect(artistDto.name).toBe(artist.name);
		expect(artistDto.artistType).toBe(artist.artistType);

		expect(() =>
			ArtistDto.create(permissionContext, deletedArtist),
		).toThrow(NotFoundException);

		expect(() => ArtistDto.create(permissionContext, hiddenArtist)).toThrow(
			NotFoundException,
		);
	});
});
