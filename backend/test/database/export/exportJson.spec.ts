import {
	QuoteUpdateCommand,
	QuoteUpdateCommandHandler,
} from '@/database/commands/quotes/QuoteUpdateCommandHandler';
import {
	WorkUpdateCommand,
	WorkUpdateCommandHandler,
} from '@/database/commands/works/WorkUpdateCommandHandler';
import { exportQuotes, exportWorks } from '@/database/export/exportJson';
import { Artist } from '@/entities/Artist';
import { User } from '@/entities/User';
import { LinkType } from '@/models/LinkType';
import { WebLinkCategory } from '@/models/WebLinkCategory';
import { ArtistType } from '@/models/artists/ArtistType';
import { QuoteType } from '@/models/quotes/QuoteType';
import { UserGroup } from '@/models/users/UserGroup';
import { WorkType } from '@/models/works/WorkType';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { FakePermissionContext } from 'test/FakePermissionContext';
import { createApplication } from 'test/createApplication';
import { createArtist, createQuote, createUser } from 'test/createEntry';

describe('exportJson', () => {
	let app: INestApplication;
	let em: EntityManager;
	let admin: User;
	let artist: Artist;
	let permissionContext: FakePermissionContext;

	beforeAll(async () => {
		app = await createApplication();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(async () => {
		em = app.get(EntityManager);

		admin = await createUser(em, {
			username: 'admin',
			email: 'admin@example.com',
			userGroup: UserGroup.Admin,
		});

		artist = await createArtist(em, {
			name: 'うたよみ',
			artistType: ArtistType.Person,
			actor: admin,
		});

		permissionContext = new FakePermissionContext(admin);
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	const createWork = (
		name: string,
	): ReturnType<WorkUpdateCommandHandler['execute']> =>
		app.get(WorkUpdateCommandHandler).execute(
			new WorkUpdateCommand(permissionContext, {
				id: 0,
				name,
				workType: WorkType.Book,
				webLinks: [
					{
						id: 0,
						url: 'https://example.com/work',
						title: 'Work',
						category: WebLinkCategory.Reference,
					},
				],
				artistLinks: [
					{
						id: 0,
						relatedArtistId: artist.id,
						linkType: LinkType.Work_Artist_Author,
						beginDate: {},
						endDate: {},
						ended: false,
					},
				],
			}),
		);

	test('exports quotes with links and timestamps', async () => {
		const work = await createWork('ほん');

		const quote = await app.get(QuoteUpdateCommandHandler).execute(
			new QuoteUpdateCommand(permissionContext, {
				id: 0,
				text: '[やまと](#やまと)うた',
				quoteType: QuoteType.Tanka,
				locale: 'ja',
				artistId: artist.id,
				webLinks: [
					{
						id: 0,
						url: 'https://example.com/quote',
						title: 'Quote',
						category: WebLinkCategory.Reference,
					},
				],
				workLinks: [
					{
						id: 0,
						relatedWorkId: work.id,
						linkType: LinkType.Quote_Work_Source,
						beginDate: {},
						endDate: {},
						ended: false,
					},
				],
			}),
		);

		await createQuote(em, {
			quoteType: QuoteType.Tanka,
			text: 'かくれた',
			locale: 'ja',
			artist,
			actor: admin,
			hidden: true,
		});

		em.clear();

		const result = await exportQuotes(em.fork());

		expect(result.totalCount).toBe(1);
		const [item] = result.items;
		expect(item.id).toBe(quote.id);
		expect(item.artist.id).toBe(artist.id);
		expect(item.createdAt).toBeInstanceOf(Date);
		expect(item.updatedAt).toBeInstanceOf(Date);
		// Created with hashtags, so there is no original text to reset to.
		expect(item.text.trim()).toBe('やまとうた');
		expect(item.hashtagLinks).toEqual([]);
		expect(item.webLinks?.map((link) => link.url)).toEqual([
			'https://example.com/quote',
		]);
		expect(item.workLinks?.map((link) => link.relatedWork.id)).toEqual([
			work.id,
		]);

		const json = JSON.parse(JSON.stringify(result));
		expect(json.items[0].createdAt).toBe(item.createdAt.toISOString());
	});

	test('resets quotes with hashtags to their original text', async () => {
		const updateQuote = (
			id: number,
			text: string,
		): ReturnType<QuoteUpdateCommandHandler['execute']> =>
			app.get(QuoteUpdateCommandHandler).execute(
				new QuoteUpdateCommand(permissionContext, {
					id,
					text,
					quoteType: QuoteType.Tanka,
					locale: 'ja',
					artistId: artist.id,
					webLinks: [],
					workLinks: [],
				}),
			);

		const quote = await updateQuote(0, 'やまとうた');
		await updateQuote(quote.id, '[やまと](#やまと)の/うた');

		em.clear();

		const result = await exportQuotes(em.fork());

		const [item] = result.items;
		expect(item.text).toBe('やまとうた');
		expect(item.plainText).toBe('やまとうた');
		expect(item.hashtagLinks).toEqual([]);
	});

	test('exports works with links and timestamps', async () => {
		const work = await createWork('ほん');

		em.clear();

		const result = await exportWorks(em.fork());

		expect(result.totalCount).toBe(1);
		const [item] = result.items;
		expect(item.id).toBe(work.id);
		expect(item.createdAt).toBeInstanceOf(Date);
		expect(item.webLinks?.map((link) => link.url)).toEqual([
			'https://example.com/work',
		]);
		expect(item.artistLinks?.map((link) => link.relatedArtist.id)).toEqual([
			artist.id,
		]);
	});
});
