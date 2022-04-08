import { NotFoundException } from '@nestjs/common';

import { QuoteObject } from '../../../src/dto/quotes/QuoteObject';
import { ArtistType } from '../../../src/models/ArtistType';
import { QuoteType } from '../../../src/models/QuoteType';
import { FakePermissionContext } from '../../FakePermissionContext';
import { createArtist, createQuote, createUser } from '../../createEntry';

test('QuoteObject', async () => {
	const artist = createArtist({
		id: 1,
		name: 'artist',
		artistType: ArtistType.Person,
	});

	const artistQuote = createQuote({
		id: 2,
		quoteType: QuoteType.Tanka,
		text: 'quote',
		locale: '',
		artist: artist,
	});

	const deletedQuote = createQuote({
		id: 3,
		quoteType: QuoteType.Tanka,
		text: 'deleted',
		locale: '',
		artist: artist,
		deleted: true,
	});

	const hiddenQuote = createQuote({
		id: 4,
		quoteType: QuoteType.Tanka,
		text: 'hidden',
		locale: '',
		artist: artist,
		hidden: true,
	});

	const viewer = await createUser({
		id: 5,
		username: 'viewer',
		email: 'viewer@example.com',
	});

	const permissionContext = new FakePermissionContext(viewer);

	const quoteObject = new QuoteObject(artistQuote, permissionContext);
	expect(quoteObject.id).toBe(artistQuote.id);
	expect(quoteObject.quoteType).toBe(artistQuote.quoteType);
	expect(quoteObject.artist.id).toBe(artist.id);
	expect(quoteObject.artist.name).toBe(artist.name);

	expect(() => new QuoteObject(deletedQuote, permissionContext)).toThrow(
		NotFoundException,
	);

	expect(() => new QuoteObject(hiddenQuote, permissionContext)).toThrow(
		NotFoundException,
	);
});
