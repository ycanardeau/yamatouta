import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication, NotFoundException } from '@nestjs/common';

import { QuoteObject } from '../../src/dto/QuoteObject';
import { Artist } from '../../src/entities/Artist';
import { Quote } from '../../src/entities/Quote';
import { ArtistType } from '../../src/models/artists/ArtistType';
import { QuoteType } from '../../src/models/quotes/QuoteType';
import { FakePermissionContext } from '../FakePermissionContext';
import { createApplication } from '../createApplication';
import { createArtist, createQuote, createUser } from '../createEntry';

describe('QuoteObject', () => {
	let app: INestApplication;
	let em: EntityManager;
	let artist: Artist;
	let quote: Quote;
	let deletedQuote: Quote;
	let hiddenQuote: Quote;
	let permissionContext: FakePermissionContext;

	beforeAll(async () => {
		app = await createApplication();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(async () => {
		em = app.get(EntityManager);

		artist = await createArtist(em as any, {
			name: 'artist',
			artistType: ArtistType.Person,
		});

		quote = await createQuote(em as any, {
			quoteType: QuoteType.Tanka,
			text: 'quote',
			locale: '',
			artist: artist,
		});

		deletedQuote = await createQuote(em as any, {
			quoteType: QuoteType.Tanka,
			text: 'deleted',
			locale: '',
			artist: artist,
			deleted: true,
		});

		hiddenQuote = await createQuote(em as any, {
			quoteType: QuoteType.Tanka,
			text: 'hidden',
			locale: '',
			artist: artist,
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
		const quoteObject = QuoteObject.create(quote, permissionContext);
		expect(quoteObject.id).toBe(quote.id);
		expect(quoteObject.quoteType).toBe(quote.quoteType);
		expect(quoteObject.artist.id).toBe(artist.id);
		expect(quoteObject.artist.name).toBe(artist.name);

		expect(() =>
			QuoteObject.create(deletedQuote, permissionContext),
		).toThrow(NotFoundException);

		expect(() =>
			QuoteObject.create(hiddenQuote, permissionContext),
		).toThrow(NotFoundException);
	});
});
