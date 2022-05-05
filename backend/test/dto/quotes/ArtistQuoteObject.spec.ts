import { NotFoundException } from '@nestjs/common';

import { QuoteObject } from '../../../src/dto/quotes/QuoteObject';
import { ArtistType } from '../../../src/models/ArtistType';
import { QuoteType } from '../../../src/models/QuoteType';
import { FakeEntityManager } from '../../FakeEntityManager';
import { FakePermissionContext } from '../../FakePermissionContext';
import { createArtist, createQuote, createUser } from '../../createEntry';

test('QuoteObject', async () => {
	const em = new FakeEntityManager();

	const artist = await createArtist(em as any, {
		id: 1,
		name: 'artist',
		artistType: ArtistType.Person,
	});

	const artistQuote = await createQuote(em as any, {
		id: 2,
		quoteType: QuoteType.Tanka,
		text: 'quote',
		locale: '',
		artist: artist,
	});

	const deletedQuote = await createQuote(em as any, {
		id: 3,
		quoteType: QuoteType.Tanka,
		text: 'deleted',
		locale: '',
		artist: artist,
		deleted: true,
	});

	const hiddenQuote = await createQuote(em as any, {
		id: 4,
		quoteType: QuoteType.Tanka,
		text: 'hidden',
		locale: '',
		artist: artist,
		hidden: true,
	});

	const viewer = await createUser(em as any, {
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
