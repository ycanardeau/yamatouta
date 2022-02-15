import { NotFoundException } from '@nestjs/common';

import { QuoteObject } from '../../../src/dto/quotes/QuoteObject';
import { ArtistType } from '../../../src/models/ArtistType';
import { QuoteType } from '../../../src/models/QuoteType';
import { FakePermissionContext } from '../../FakePermissionContext';
import { createArtist, createArtistQuote, createUser } from '../../createEntry';

test('ArtistQuoteObject', async () => {
	const artist = createArtist({
		id: 1,
		name: 'artist',
		artistType: ArtistType.Person,
	});

	const artistQuote = createArtistQuote({
		id: 2,
		quoteType: QuoteType.Tanka,
		text: 'quote',
		artist: artist,
	});

	const deletedArtistQuote = createArtistQuote({
		id: 3,
		quoteType: QuoteType.Tanka,
		text: 'deleted',
		artist: artist,
		deleted: true,
	});

	const hiddenArtistQuote = createArtistQuote({
		id: 4,
		quoteType: QuoteType.Tanka,
		text: 'hidden',
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
	expect(quoteObject.author.id).toBe(artist.id);
	expect(quoteObject.author.name).toBe(artist.name);

	expect(
		() => new QuoteObject(deletedArtistQuote, permissionContext),
	).toThrow(NotFoundException);

	expect(() => new QuoteObject(hiddenArtistQuote, permissionContext)).toThrow(
		NotFoundException,
	);
});
