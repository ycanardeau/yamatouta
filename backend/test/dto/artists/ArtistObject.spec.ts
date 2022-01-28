import { NotFoundException } from '@nestjs/common';

import { ArtistObject } from '../../../src/dto/artists/ArtistObject';
import { Artist } from '../../../src/entities/Artist';
import { User } from '../../../src/entities/User';
import { ArtistType } from '../../../src/models/ArtistType';
import { PasswordHashAlgorithm } from '../../../src/models/PasswordHashAlgorithm';
import { FakePermissionContext } from '../../FakePermissionContext';

test('ArtistObject', () => {
	const artist = new Artist({
		name: 'artist',
		artistType: ArtistType.Person,
	});
	artist.id = 1;

	const deletedArtist = new Artist({
		name: 'deleted',
		artistType: ArtistType.Person,
	});
	deletedArtist.id = 2;
	deletedArtist.deleted = true;

	const hiddenArtist = new Artist({
		name: 'hidden',
		artistType: ArtistType.Person,
	});
	hiddenArtist.id = 3;
	hiddenArtist.hidden = true;

	const viewer = new User({
		name: 'viewer',
		email: 'viewer@example.com',
		normalizedEmail: '',
		passwordHashAlgorithm: PasswordHashAlgorithm.Bcrypt,
		salt: '',
		passwordHash: '',
	});
	viewer.id = 4;

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
