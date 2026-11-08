import { IArtistDto } from '@/dto/IArtistDto';
import { IQuoteDto } from '@/dto/IQuoteDto';
import { ITranslationDto } from '@/dto/ITranslationDto';
import { IUserDto } from '@/dto/IUserDto';
import { IWorkDto } from '@/dto/IWorkDto';
import { EntryType } from '@/models/EntryType';
import { LinkType } from '@/models/LinkType';
import { WebLinkCategory } from '@/models/WebLinkCategory';
import { QuoteType } from '@/models/quotes/QuoteType';
import { UserGroup } from '@/models/users/UserGroup';

interface IEntryRow {
	createdAt: string;
	updatedAt: string;
	deleted?: boolean;
	hidden?: boolean;
}

export interface ITranslationRow extends ITranslationDto, IEntryRow {
	inishienomanabi_tags?: string[];
	actorId?: number;
}

export interface IArtistRow extends IArtistDto, IEntryRow {}

export interface IUserRow extends IUserDto, IEntryRow {
	userGroup?: UserGroup;
}

export interface IQuoteRow extends IQuoteDto, IEntryRow {}

export interface IWorkRow extends IWorkDto, IEntryRow {}

interface ICollections {
	artists: IArtistRow;
	quotes: IQuoteRow;
	translations: ITranslationRow;
	users: IUserRow;
	works: IWorkRow;
}

// Each collection is an optional `src/database/<name>.json` file in the
// `{ items, totalCount }` shape returned by the list endpoints, or a series
// of `<name>.1.json`, `<name>.2.json`, ... files whose items are concatenated,
// to stay under the per-file size limit of Cloudflare Pages. Files are
// emitted as hashed assets and fetched on first use, so they stay out of the
// JS bundle. A missing file is treated as an empty collection.
const urls = import.meta.glob('/src/database/*.json', {
	as: 'url',
	eager: true,
});

const getUrls = (name: keyof ICollections): string[] =>
	Object.entries(urls)
		.flatMap(([path, url]) => {
			const match = /^\/src\/database\/(\w+)(?:\.(\d+))?\.json$/.exec(
				path,
			);
			return match?.[1] === name
				? [{ index: Number(match[2] ?? 0), url }]
				: [];
		})
		.sort((a, b) => a.index - b.index)
		.map(({ url }) => url);

// Compact form of a quote in the quotes.<n>.json files, written by
// backend/src/database/export/QuoteRecord.ts. Artists and works are referenced
// by ID, and fields that are the same for every quote are left out.
interface IQuoteRecord {
	id: number;
	quoteType: QuoteType;
	text: string;
	transcription: string;
	locale: string;
	artistId: number;
	workIds?: number[];
	// Full URLs, or URL fragments of waka on lapis.nichibun.ac.jp.
	webLinks?: string[];
	// Seconds since the Unix epoch.
	createdAt: number;
	updatedAt: number;
}

const toWebLinkUrl = (url: string): string =>
	url.includes('://')
		? url
		: `https://lapis.nichibun.ac.jp/waka/waka_${
				url.split('-')[0]
		  }.html#${url}`;

const toDateString = (unixTime: number): string =>
	new Date(unixTime * 1000).toISOString();

const decodeQuotes = async (records: IQuoteRecord[]): Promise<IQuoteRow[]> => {
	const [artists, works] = await Promise.all([
		loadCollection('artists'),
		loadCollection('works'),
	]);

	const artistsById = new Map(
		artists.map((artist): [number, IArtistDto] => [
			artist.id,
			{
				id: artist.id,
				entryType: EntryType.Artist,
				name: artist.name,
				artistType: artist.artistType,
			},
		]),
	);

	const worksById = new Map(
		works.map((work): [number, IWorkDto] => [
			work.id,
			{
				id: work.id,
				entryType: EntryType.Work,
				name: work.name,
				workType: work.workType,
			},
		]),
	);

	return records.flatMap((record) => {
		const artist = artistsById.get(record.artistId);

		// For example, the artist is hidden.
		if (!artist) return [];

		return [
			{
				id: record.id,
				entryType: EntryType.Quote,
				text: record.text,
				plainText: record.text,
				transcription: record.transcription,
				quoteType: record.quoteType,
				locale: record.locale,
				artist,
				sourceUrl: '',
				hashtagLinks: [],
				webLinks: (record.webLinks ?? []).map((url, index) => ({
					id: index + 1,
					url: toWebLinkUrl(url),
					title: '',
					category: WebLinkCategory.Reference,
				})),
				workLinks: (record.workIds ?? []).flatMap((workId, index) => {
					const relatedWork = worksById.get(workId);

					return relatedWork
						? [
								{
									id: index + 1,
									linkType: LinkType.Quote_Work_Source,
									beginDate: {},
									endDate: {},
									ended: false,
									relatedWork,
								},
						  ]
						: [];
				}),
				createdAt: toDateString(record.createdAt),
				updatedAt: toDateString(record.updatedAt),
			},
		];
	});
};

const decoders: {
	[K in keyof ICollections]?: (items: any[]) => Promise<ICollections[K][]>;
} = {
	quotes: decodeQuotes,
};

const fetchItems = async (url: string): Promise<unknown[]> => {
	const response = await fetch(url);

	if (!response.ok)
		throw new Error(`Failed to load ${url}: ${response.status}`);

	const result: { items: unknown[] } = await response.json();

	return result.items;
};

const loadItems = async <K extends keyof ICollections>(
	name: K,
): Promise<ICollections[K][]> => {
	const items = (await Promise.all(getUrls(name).map(fetchItems))).flat();

	const decode = decoders[name];
	const rows = decode ? await decode(items) : (items as ICollections[K][]);

	return (rows as IEntryRow[]).filter(
		(item) => !item.deleted && !item.hidden,
	) as ICollections[K][];
};

const cache = new Map<keyof ICollections, Promise<unknown[]>>();

export const loadCollection = <K extends keyof ICollections>(
	name: K,
): Promise<ICollections[K][]> => {
	let promise = cache.get(name);

	if (!promise) {
		promise = loadItems(name).catch((error) => {
			cache.delete(name);
			throw error;
		});

		cache.set(name, promise);
	}

	return promise as Promise<ICollections[K][]>;
};

export class NotFoundError extends Error {
	constructor(entryType: string, key: string | number) {
		super(`${entryType} ${key} not found.`);
	}
}

export const findById = async <K extends keyof ICollections>(
	name: K,
	id: number,
): Promise<ICollections[K]> => {
	const items = await loadCollection(name);
	const item = items.find((item) => item.id === id);

	if (!item) throw new NotFoundError(name, id);

	return item;
};
