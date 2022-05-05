import { NotFoundException } from '@nestjs/common';

import { ArtistObject } from '../../../src/dto/artists/ArtistObject';
import { ArtistType } from '../../../src/models/ArtistType';
import { FakeEntityManager } from '../../FakeEntityManager';
import { FakePermissionContext } from '../../FakePermissionContext';
import { createArtist, createUser } from '../../createEntry';

test('ArtistObject', async () => {
	const em = new FakeEntityManager();

	const artist = await createArtist(em as any, {
		name: 'artist',
		artistType: ArtistType.Person,
	});

	const deletedArtist = await createArtist(em as any, {
		name: 'deleted',
		artistType: ArtistType.Person,
		deleted: true,
	});

	const hiddenArtist = await createArtist(em as any, {
		name: 'hidden',
		artistType: ArtistType.Person,
		hidden: true,
	});

	const viewer = await createUser(em as any, {
		username: 'viewer',
		email: 'viewer@example.com',
	});

	const permissionContext = new FakePermissionContext(viewer);

	const artistObject = new ArtistObject(artist, permissionContext);
	expect(artistObject.id).toBe(artist.id);
	expect(artistObject.name).toBe(artist.name);
	expect(artistObject.artistType).toBe(artist.artistType);

	expect(() => new ArtistObject(deletedArtist, permissionContext)).toThrow(
		NotFoundException,
	);

	expect(() => new ArtistObject(hiddenArtist, permissionContext)).toThrow(
		NotFoundException,
	);
});
