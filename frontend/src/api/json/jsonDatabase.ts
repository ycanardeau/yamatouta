import { IArtistDto } from '@/dto/IArtistDto';
import { IQuoteDto } from '@/dto/IQuoteDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { ITranslationDto } from '@/dto/ITranslationDto';
import { IUserDto } from '@/dto/IUserDto';
import { IWorkDto } from '@/dto/IWorkDto';
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
// `{ items, totalCount }` shape returned by the list endpoints. Files are
// emitted as hashed assets and fetched on first use, so they stay out of the
// JS bundle. A missing file is treated as an empty collection.
const urls = import.meta.glob('/src/database/*.json', {
	as: 'url',
	eager: true,
});

const getUrl = (name: keyof ICollections): string | undefined =>
	urls[`/src/database/${name}.json`];

const cache = new Map<keyof ICollections, Promise<unknown[]>>();

const fetchItems = async <T extends IEntryRow>(url: string): Promise<T[]> => {
	const response = await fetch(url);

	if (!response.ok)
		throw new Error(`Failed to load ${url}: ${response.status}`);

	const result: ISearchResultDto<T> = await response.json();

	return result.items.filter((item) => !item.deleted && !item.hidden);
};

export const loadCollection = <K extends keyof ICollections>(
	name: K,
): Promise<ICollections[K][]> => {
	let promise = cache.get(name);

	if (!promise) {
		const url = getUrl(name);

		promise = url
			? fetchItems<ICollections[K]>(url).catch((error) => {
					cache.delete(name);
					throw error;
			  })
			: Promise.resolve([]);

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
