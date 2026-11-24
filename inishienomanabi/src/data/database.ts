// Reads the JSON files exported by scripts/export.ts and answers the same
// queries as the PHP mappers of inishienomanabi.net did.

export type TranslationStatus = 'Verified' | 'Unverified' | 'Reopened';

export interface Translation {
	id: number;
	status: TranslationStatus;
	japanese: string;
	reading: string;
	yamatokotoba: string;
	category: string;
	tags: string[];
	description: string;
	source: string;
	score: number;
	voteCount: number;
	upvotes: number;
	downvotes: number;
	userId: number;
	creationDate: string;
	lastEditDate: string | null;
	activationDate: string | null;
}

export interface Revision {
	id: number;
	translationId: number;
	japanese: string;
	reading: string;
	yamatokotoba: string;
	category: string;
	tags: string[];
	userId: number;
	creationDate: string;
}

export type SuggestedEditStatus =
	| 'Pending'
	| 'Approved'
	| 'Minor Diff'
	| 'Rejected';

// A review, with the suggested edit it voted for.
export interface Review {
	id: number;
	action: string;
	translationId: number;
	userId: number;
	summary: string;
	creationDate: string;
	status: SuggestedEditStatus;
	japanese: string;
	reading: string;
	yamatokotoba: string;
	category: string;
	tags: string[];
}

export interface Tag {
	name: string;
	count: number;
}

export interface User {
	id: number;
	username: string;
	role: string;
	name: string;
	websiteUrl: string;
	aboutMe: string;
	hasImage: boolean;
	creationDate: string;
}

export interface Page<T> {
	items: T[];
	totalCount: number;
}

interface Collections {
	reviews: Review;
	revisions: Revision;
	tags: Tag;
	translations: Translation;
	users: User;
}

// Files are emitted as hashed assets and fetched on first use, so they stay
// out of the JS bundle.
const urls = import.meta.glob('/src/database/*.json', {
	as: 'url',
	eager: true,
});

const cache = new Map<keyof Collections, Promise<unknown[]>>();

const load = <K extends keyof Collections>(
	name: K,
): Promise<Collections[K][]> => {
	let promise = cache.get(name);

	if (!promise) {
		promise = fetch(urls[`/src/database/${name}.json`])
			.then((response) => {
				if (!response.ok)
					throw new Error(
						`Failed to load ${name}: ${response.status}`,
					);
				return response.json();
			})
			.then((result: { items: unknown[] }) => result.items)
			.catch((error) => {
				cache.delete(name);
				throw error;
			});
		cache.set(name, promise);
	}

	return promise as Promise<Collections[K][]>;
};

const collator = new Intl.Collator('ja');

type Comparer<T> = (a: T, b: T) => number;

const by =
	<T>(key: (item: T) => string | number | null, order: 'asc' | 'desc') =>
	(a: T, b: T): number => {
		const x = key(a) ?? '';
		const y = key(b) ?? '';
		const result =
			typeof x === 'number' && typeof y === 'number'
				? x - y
				: collator.compare(String(x), String(y));
		return order === 'asc' ? result : -result;
	};

const thenBy =
	<T>(...comparers: Comparer<T>[]): Comparer<T> =>
	(a, b) => {
		for (const comparer of comparers) {
			const result = comparer(a, b);
			if (result !== 0) return result;
		}
		return 0;
	};

const paginate = <T>(items: T[], page: number, pageSize: number): Page<T> => ({
	items: items.slice((page - 1) * pageSize, page * pageSize),
	totalCount: items.length,
});

export const countTranslations = async (): Promise<number> =>
	(await load('translations')).length;

export type TranslationSort = 'ja' | 'ojp' | 'id';

// findAllValid
export const listTranslations = async (
	sort: TranslationSort,
	page: number,
	pageSize: number,
): Promise<Page<Translation>> => {
	const comparer: Comparer<Translation> =
		sort === 'ojp'
			? by((t) => t.yamatokotoba, 'asc')
			: sort === 'id'
			? by((t) => t.id, 'desc')
			: by((t) => t.reading, 'asc');

	return paginate(
		[...(await load('translations'))].sort(comparer),
		page,
		pageSize,
	);
};

// findAllPopular
export const listPopularTranslations = async (
	page: number,
	pageSize: number,
): Promise<Page<Translation>> =>
	paginate(
		(await load('translations'))
			.filter((t) => t.score > 0)
			.sort(
				thenBy(
					by((t) => t.score, 'desc'),
					by((t) => t.id, 'desc'),
				),
			),
		page,
		pageSize,
	);

export type StatusSort = 'date' | 'vote';

// findAllByStatus
export const listTranslationsByStatus = async (
	status: TranslationStatus,
	sort: StatusSort,
	page: number,
	pageSize: number,
): Promise<Page<Translation>> =>
	paginate(
		(await load('translations'))
			.filter((t) => t.status === status)
			.sort(
				thenBy(
					sort === 'vote'
						? by((t) => t.voteCount, 'desc')
						: by((t) => t.activationDate, 'desc'),
					by((t) => t.id, 'desc'),
				),
			),
		page,
		pageSize,
	);

// The home page shows the translations of a random word.
export const listRandomTranslations = async (
	pageSize: number,
): Promise<Translation[]> => {
	const translations = await load('translations');
	if (translations.length === 0) return [];

	const word =
		translations[Math.floor(Math.random() * translations.length)].japanese;

	return translations
		.filter((t) => t.japanese === word)
		.sort(by((t) => t.reading, 'asc'))
		.slice(0, pageSize);
};

export const getRandomWord = async (): Promise<string | undefined> => {
	const translations = await load('translations');
	return translations[Math.floor(Math.random() * translations.length)]
		?.japanese;
};

export const getTranslation = async (
	id: number,
): Promise<Translation | undefined> =>
	(await load('translations')).find((t) => t.id === id);

export type TagSort = 'popular' | 'name';

export const listTags = async (sort: TagSort, limit?: number): Promise<Tag[]> =>
	[...(await load('tags'))]
		.sort(
			sort === 'popular'
				? by((t) => t.count, 'desc')
				: by((t) => t.name, 'asc'),
		)
		.slice(0, limit);

// findAllByTranslationId
export const listRevisions = async (
	translationId: number,
): Promise<(Revision & { user?: User })[]> => {
	const users = await load('users');
	return (await load('revisions'))
		.filter((r) => r.translationId === translationId)
		.sort(by((r) => r.id, 'desc'))
		.slice(0, 50)
		.map((r) => ({ ...r, user: users.find((u) => u.id === r.userId) }));
};

// search with a tag and no words.
export const listTranslationsByTag = async (
	tagName: string,
	sort: Exclude<TranslationSort, 'id'>,
	page: number,
	pageSize: number,
): Promise<Page<Translation>> =>
	paginate(
		(await load('translations'))
			.filter((t) => t.tags.includes(tagName))
			.sort(
				sort === 'ojp'
					? thenBy(
							by((t) => t.yamatokotoba, 'asc'),
							by((t) => t.reading, 'asc'),
							by((t) => t.japanese, 'asc'),
					  )
					: thenBy(
							by((t) => t.reading, 'asc'),
							by((t) => t.japanese, 'asc'),
							by((t) => t.yamatokotoba, 'asc'),
					  ),
			),
		page,
		pageSize,
	);

// getRelatedTags: the other tags of the given translations, most used first.
export const listRelatedTags = async (
	translations: Translation[],
	excludeTagName: string,
): Promise<Tag[]> => {
	const names = new Set(translations.flatMap((t) => t.tags));
	names.delete(excludeTagName);
	return (await listTags('popular')).filter((t) => names.has(t.name));
};

export const getUser = async (id: number): Promise<User | undefined> =>
	(await load('users')).find((u) => u.id === id);

// Usernames were compared case-insensitively by MySQL.
export const getUserByUsername = async (
	username: string,
): Promise<User | undefined> => {
	const lower = username.toLowerCase();
	return (await load('users')).find(
		(u) => u.username.toLowerCase() === lower,
	);
};

export const listUsers = async (
	page: number,
	pageSize: number,
): Promise<Page<User>> =>
	paginate(
		[...(await load('users'))].sort(by((u) => u.id, 'desc')),
		page,
		pageSize,
	);

// findAllByUserId of TranslationMapper
export const listTranslationsByUser = async (
	userId: number,
	page: number,
	pageSize: number,
): Promise<Page<Translation>> =>
	paginate(
		(await load('translations'))
			.filter((t) => t.userId === userId)
			.sort(by((t) => t.id, 'desc')),
		page,
		pageSize,
	);

// findAllByUserId of ReviewMapper
export const listReviewsByUser = async (
	userId: number,
	page: number,
	pageSize: number,
): Promise<Page<Review>> =>
	paginate(
		(await load('reviews'))
			.filter((r) => r.userId === userId && r.action !== 'Create')
			.sort(by((r) => r.id, 'desc')),
		page,
		pageSize,
	);

export const profileImageUrl = (user: User): string =>
	user.hasImage
		? `/images/profiles/${user.id}.png`
		: '/images/default_profile.png';
