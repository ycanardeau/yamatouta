import { toQuoteRecord } from '@/database/export/QuoteRecord';
import { QuoteDto } from '@/dto/QuoteDto';
import { WorkDto } from '@/dto/WorkDto';
import { Quote } from '@/entities/Quote';
import { QuoteRevision } from '@/entities/Revision';
import { Work } from '@/entities/Work';
import { QuoteOptionalField } from '@/models/quotes/QuoteOptionalField';
import { QuoteSnapshot } from '@/models/snapshots/QuoteSnapshot';
import { WorkOptionalField } from '@/models/works/WorkOptionalField';
import { PermissionContext } from '@/services/PermissionContext';
import {
	AnyEntity,
	EntityManager,
	EntityName,
	FilterQuery,
} from '@mikro-orm/core';
import { Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

// Exports entries to the `{ items, totalCount }` JSON files read by the
// frontend's static (`VITE_DATA_SOURCE=json`) build from
// frontend/src/database.

const logger = new Logger('exportJson');

interface IExportedEntry {
	createdAt: Date;
	updatedAt: Date;
}

interface IExportResult<T> {
	items: (T & IExportedEntry)[];
	totalCount: number;
}

// Anonymous visitor, so the export contains only what the public site shows.
const createAnonymousPermissionContext = (): PermissionContext =>
	new PermissionContext({ socket: { remoteAddress: '::1' } } as any);

// Populating every entry in a single query overflows the call stack in
// MikroORM, so entries are fetched in batches of ascending IDs.
const batchSize = 1000;

const exportEntries = async <
	TEntry extends AnyEntity<TEntry> & IExportedEntry & { id: number },
	TDto,
>(
	em: EntityManager,
	entryType: string,
	entityName: EntityName<TEntry>,
	where: FilterQuery<TEntry>,
	populate: string[],
	toDto: (entry: TEntry) => TDto,
): Promise<IExportResult<TDto>> => {
	const items: (TDto & IExportedEntry)[] = [];

	for (let lastId = 0; ; ) {
		const entries = await em.find(
			entityName,
			{ $and: [where, { id: { $gt: lastId } }] } as FilterQuery<TEntry>,
			{
				populate: populate as any,
				orderBy: { id: 'asc' } as any,
				limit: batchSize,
			},
		);

		for (const entry of entries) {
			try {
				items.push({
					...toDto(entry),
					createdAt: entry.createdAt,
					updatedAt: entry.updatedAt,
				});
			} catch (error) {
				// For example, the entry links to a deleted or hidden entry.
				logger.warn(`Skipped ${entryType} ${entry.id}: ${error}`);
			}
		}

		em.clear();

		if (entries.length < batchSize) break;

		lastId = entries[entries.length - 1].id;
	}

	return { items, totalCount: items.length };
};

// Hashtags are written as `[label](#name)` links in the quote text.
const hashtagMarkup = '](#';

// The static site has no hashtags, so quotes whose text was edited to add
// hashtag links are reset to the text of their first revision.
const findOriginalTexts = async (
	em: EntityManager,
): Promise<Map<number, string>> => {
	const revisions = await em.find(
		QuoteRevision,
		{
			version: 1,
			quote: {
				deleted: false,
				hidden: false,
				text: { $like: `%${hashtagMarkup}%` },
			},
		},
		{ orderBy: { id: 'asc' } },
	);

	const originalTexts = new Map<number, string>();

	for (const revision of revisions) {
		if (originalTexts.has(revision.quote.id)) continue;

		const snapshot: QuoteSnapshot = JSON.parse(revision.snapshot);

		// Already had hashtags when created, so fall back to the plain text.
		if (snapshot.text.includes(hashtagMarkup)) continue;

		originalTexts.set(revision.quote.id, snapshot.text);
	}

	em.clear();

	return originalTexts;
};

export const exportQuotes = async (
	em: EntityManager,
): Promise<IExportResult<QuoteDto>> => {
	const permissionContext = createAnonymousPermissionContext();

	const originalTexts = await findOriginalTexts(em);

	return exportEntries(
		em,
		'quote',
		Quote,
		{ deleted: false, hidden: false },
		[
			'artist',
			'hashtagLinks.relatedHashtag',
			'webLinks.address',
			'workLinks.relatedWork',
		],
		(quote) => {
			const dto = QuoteDto.create(
				permissionContext,
				quote,
				Object.values(QuoteOptionalField),
			);

			const originalText =
				originalTexts.get(quote.id) ??
				(dto.text.includes(hashtagMarkup) ? dto.plainText : undefined);

			return {
				...dto,
				...(originalText !== undefined && {
					text: originalText,
					plainText: originalText,
				}),
				hashtagLinks: [],
			};
		},
	);
};

export const exportWorks = async (
	em: EntityManager,
): Promise<IExportResult<WorkDto>> => {
	const permissionContext = createAnonymousPermissionContext();

	return exportEntries(
		em,
		'work',
		Work,
		{ deleted: false, hidden: false },
		['webLinks.address', 'artistLinks.relatedArtist'],
		(work) =>
			WorkDto.create(
				permissionContext,
				work,
				Object.values(WorkOptionalField),
			),
	);
};

const writeJson = async (path: string, value: unknown): Promise<void> => {
	await fs.writeFile(path, `${JSON.stringify(value, null, '\t')}\n`);
};

// Cloudflare Pages serves files of up to 25 MiB.
const maxFileSize = 20 * 1024 * 1024;

// Writes items to `<name>.1.json`, `<name>.2.json` and so on, one item per
// line, starting a new file before one would exceed the size limit.
const writeSplitJson = async (
	outDir: string,
	name: string,
	items: unknown[],
): Promise<void> => {
	const filePattern = new RegExp(`^${name}(\\.\\d+)?\\.json$`);
	for (const file of await fs.readdir(outDir)) {
		if (filePattern.test(file)) await fs.unlink(join(outDir, file));
	}

	let lines: string[] = [];
	let size = 0;
	let fileCount = 0;

	const flush = async (): Promise<void> => {
		fileCount++;
		await fs.writeFile(
			join(outDir, `${name}.${fileCount}.json`),
			`{"items":[\n${lines.join(',\n')}\n]}\n`,
		);
		lines = [];
		size = 0;
	};

	for (const item of items) {
		const line = JSON.stringify(item);
		const lineSize = Buffer.byteLength(line) + 2;

		if (lines.length > 0 && size + lineSize > maxFileSize) await flush();

		lines.push(line);
		size += lineSize;
	}

	if (lines.length > 0) await flush();
};

export const exportJson = async (
	em: EntityManager,
	outDir: string,
): Promise<void> => {
	await fs.mkdir(outDir, { recursive: true });

	const quotes = await exportQuotes(em);
	await writeSplitJson(outDir, 'quotes', quotes.items.map(toQuoteRecord));
	logger.log(`Exported ${quotes.totalCount} quotes.`);

	const works = await exportWorks(em);
	await writeJson(join(outDir, 'works.json'), works);
	logger.log(`Exported ${works.totalCount} works.`);
};
