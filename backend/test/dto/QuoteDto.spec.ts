import { QuoteDto } from '@/dto/QuoteDto';
import { Artist } from '@/entities/Artist';
import { Quote } from '@/entities/Quote';
import { ArtistType } from '@/models/artists/ArtistType';
import { QuoteType } from '@/models/quotes/QuoteType';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { FakePermissionContext } from 'test/FakePermissionContext';
import { createApplication } from 'test/createApplication';
import { createArtist, createQuote, createUser } from 'test/createEntry';

describe('QuoteDto', () => {
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

		const user = await createUser(em as any, {
			username: 'user',
			email: 'user@example.com',
		});

		artist = await createArtist(em as any, {
			name: 'artist',
			artistType: ArtistType.Person,
			actor: user,
		});

		quote = await createQuote(em as any, {
			quoteType: QuoteType.Tanka,
			text: 'quote',
			locale: '',
			artist: artist,
			actor: user,
		});

		deletedQuote = await createQuote(em as any, {
			quoteType: QuoteType.Tanka,
			text: 'deleted',
			locale: '',
			artist: artist,
			actor: user,
			deleted: true,
		});

		hiddenQuote = await createQuote(em as any, {
			quoteType: QuoteType.Tanka,
			text: 'hidden',
			locale: '',
			artist: artist,
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
		const quoteDto = QuoteDto.create(permissionContext, quote);
		expect(quoteDto.id).toBe(quote.id);
		expect(quoteDto.quoteType).toBe(quote.quoteType);
		expect(quoteDto.artist.id).toBe(artist.id);
		expect(quoteDto.artist.name).toBe(artist.name);

		expect(() => QuoteDto.create(permissionContext, deletedQuote)).toThrow(
			NotFoundException,
		);

		expect(() => QuoteDto.create(permissionContext, hiddenQuote)).toThrow(
			NotFoundException,
		);
	});
});
