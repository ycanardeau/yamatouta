import { NotFoundException } from '@nestjs/common';

import { QuoteObject } from '../../../src/dto/quotes/QuoteObject';
import { Artist } from '../../../src/entities/Artist';
import { ArtistQuote } from '../../../src/entities/ArtistQuote';
import { User } from '../../../src/entities/User';
import { ArtistType } from '../../../src/models/ArtistType';
import { PasswordHashAlgorithm } from '../../../src/models/PasswordHashAlgorithm';
import { QuoteType } from '../../../src/models/QuoteType';
import { FakePermissionContext } from '../../FakePermissionContext';

test('ArtistQuoteObject', () => {
	const artist = new Artist({
		name: 'artist',
		artistType: ArtistType.Person,
	});
	artist.id = 1;

	const artistQuote = new ArtistQuote({
		quoteType: QuoteType.Tanka,
		text: 'quote',
		artist: artist,
	});
	artistQuote.id = 2;

	const deletedArtistQuote = new ArtistQuote({
		quoteType: QuoteType.Tanka,
		text: 'deleted',
		artist: artist,
	});
	deletedArtistQuote.id = 3;
	deletedArtistQuote.deleted = true;

	const hiddenArtistQuote = new ArtistQuote({
		quoteType: QuoteType.Tanka,
		text: 'hidden',
		artist: artist,
	});
	hiddenArtistQuote.id = 4;
	hiddenArtistQuote.hidden = true;

	const viewer = new User({
		name: 'viewer',
		email: 'viewer@example.com',
		normalizedEmail: '',
		passwordHashAlgorithm: PasswordHashAlgorithm.Bcrypt,
		salt: '',
		passwordHash: '',
	});
	viewer.id = 5;

	const permissionContext = new FakePermissionContext(viewer);

	const quoteObject = new QuoteObject(artistQuote, permissionContext);
	expect(quoteObject.id).toBe(artistQuote.id);
	expect(quoteObject.quoteType).toBe(artistQuote.quoteType);
	expect(quoteObject.author.id).toBe(artist.id);
	expect(quoteObject.author.name).toBe(artist.name);

	expect(
		() => new QuoteObject(deletedArtistQuote, permissionContext),
	).toThrow(NotFoundException);

	expect(() => new QuoteObject(hiddenArtistQuote, permissionContext)).toThrow(
		NotFoundException,
	);
});
