// Exports the public data of inishienomanabi.net from a phpMyAdmin SQL dump to
// the JSON files read by the static site, without needing a database.
//
// Usage: node scripts/export.ts <dump.sql>
//
// Only what anonymous visitors could see on inishienomanabi.net is exported.
// Passwords, email addresses, IP addresses, logins, comments and votes by
// user are left out.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type Value = string | number | Buffer | null;
type Row = Record<string, Value>;

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const databaseDir = join(rootDir, 'src', 'database');
const profileImagesDir = join(rootDir, 'public', 'images', 'profiles');

// Parses `INSERT INTO `Table` (`a`, `b`) VALUES (...), (...);` statements.
const parseDump = (sql: string): Map<string, Row[]> => {
	const tables = new Map<string, Row[]>();
	const insertPattern = /^INSERT INTO `(\w+)` \(([^)]*)\) VALUES\s*/gm;

	let match: RegExpExecArray | null;
	while ((match = insertPattern.exec(sql))) {
		const table = match[1];
		const columns = match[2].split(',').map((c) => c.trim().slice(1, -1));
		const rows = tables.get(table) ?? [];
		tables.set(table, rows);

		let i = insertPattern.lastIndex;
		for (;;) {
			while (/\s/.test(sql[i])) i++;
			if (sql[i] !== '(') throw new Error(`Expected ( at ${i}`);
			i++;

			const values: Value[] = [];
			for (;;) {
				while (sql[i] === ' ') i++;
				if (sql[i] === "'") {
					let value = '';
					i++;
					for (;;) {
						const c = sql[i++];
						if (c === '\\') {
							const e = sql[i++];
							value +=
								{
									n: '\n',
									r: '\r',
									t: '\t',
									'0': '\0',
									Z: '\x1a',
								}[e] ?? e;
						} else if (c === "'") {
							if (sql[i] === "'") {
								value += "'";
								i++;
							} else break;
						} else value += c;
					}
					values.push(value);
				} else {
					const end = sql.slice(i).search(/[,)]/);
					const token = sql.slice(i, i + end).trim();
					i += end;
					values.push(
						token === 'NULL'
							? null
							: token.startsWith('0x')
							? Buffer.from(token.slice(2), 'hex')
							: Number(token),
					);
				}
				while (sql[i] === ' ') i++;
				if (sql[i] === ',') {
					i++;
					continue;
				}
				if (sql[i] === ')') {
					i++;
					break;
				}
				throw new Error(`Unexpected ${sql[i]} at ${i}`);
			}

			rows.push(
				Object.fromEntries(columns.map((c, j) => [c, values[j]])),
			);

			while (/\s/.test(sql[i])) i++;
			if (sql[i] === ',') {
				i++;
				continue;
			}
			if (sql[i] === ';') break;
			throw new Error(`Unexpected ${sql[i]} at ${i}`);
		}
		insertPattern.lastIndex = i;
	}

	return tables;
};

const str = (value: Value): string => (value === null ? '' : String(value));

const tagNames = (value: Value): string[] =>
	str(value).split(' ').filter(Boolean);

const writeJson = (name: string, items: unknown[]): void => {
	writeFileSync(
		join(databaseDir, `${name}.json`),
		`{"items":[\n${items
			.map((item) => JSON.stringify(item))
			.join(',\n')}\n]}\n`,
	);
	console.log(`Exported ${items.length} ${name}.`);
};

const main = (): void => {
	const dumpPath = process.argv[2];
	if (!dumpPath) throw new Error('Usage: node scripts/export.ts <dump.sql>');

	const tables = parseDump(readFileSync(dumpPath, 'utf8'));
	const table = (name: string): Row[] => tables.get(name) ?? [];

	const translations = table('Translations').filter(
		(t) => t.Status !== 'Deleted',
	);
	const translationIds = new Set(translations.map((t) => t.TranslationId));

	const voteCounts = new Map<Value, { upvotes: number; downvotes: number }>();
	for (const vote of table('Votes')) {
		const counts = voteCounts.get(vote.TranslationId) ?? {
			upvotes: 0,
			downvotes: 0,
		};
		if (vote.Action === 'Upvote') counts.upvotes++;
		if (vote.Action === 'Downvote') counts.downvotes++;
		voteCounts.set(vote.TranslationId, counts);
	}

	mkdirSync(databaseDir, { recursive: true });

	writeJson(
		'translations',
		translations.map((t) => ({
			id: t.TranslationId,
			status: t.Status,
			japanese: str(t.Japanese),
			reading: str(t.Reading),
			yamatokotoba: str(t.Yamatokotoba),
			category: str(t.Category),
			tags: tagNames(t.Tags),
			description: str(t.Description),
			source: str(t.Source),
			score: t.Score,
			voteCount: t.VoteCount,
			...(voteCounts.get(t.TranslationId) ?? {
				upvotes: 0,
				downvotes: 0,
			}),
			userId: t.UserId,
			creationDate: t.CreationDate,
			lastEditDate: t.LastEditDate,
			activationDate: t.ActivationDate,
		})),
	);

	writeJson(
		'revisions',
		table('Revisions')
			.filter((r) => translationIds.has(r.TranslationId))
			.map((r) => ({
				id: r.RevisionId,
				translationId: r.TranslationId,
				japanese: str(r.Japanese),
				reading: str(r.Reading),
				yamatokotoba: str(r.Yamatokotoba),
				category: str(r.Category),
				tags: tagNames(r.Tags),
				userId: r.UserId,
				creationDate: r.CreationDate,
			})),
	);

	const suggestedEdits = new Map(
		table('SuggestedEdits').map((s) => [s.SuggestedEditId, s]),
	);

	// Each review carries the edit it voted for, as shown on the reviews page
	// of users.
	writeJson(
		'reviews',
		table('Reviews')
			.filter((r) => translationIds.has(r.TranslationId))
			.map((r) => {
				const s = suggestedEdits.get(r.SuggestedEditId);
				if (!s)
					throw new Error(
						`Review ${r.ReviewId} has no suggested edit.`,
					);
				return {
					id: r.ReviewId,
					action: r.Action,
					translationId: r.TranslationId,
					userId: r.UserId,
					summary: str(r.Summary),
					creationDate: r.CreationDate,
					status: s.Status,
					japanese: str(s.Japanese),
					reading: str(s.Reading),
					yamatokotoba: str(s.Yamatokotoba),
					category: str(s.Category),
					tags: tagNames(s.Tags),
				};
			}),
	);

	writeJson(
		'tags',
		table('Tags').map((t) => ({ name: str(t.TagName), count: t.Count })),
	);

	rmSync(profileImagesDir, { recursive: true, force: true });
	mkdirSync(profileImagesDir, { recursive: true });

	const users = table('Users');
	for (const user of users) {
		if (user.ImageData instanceof Buffer && user.ImageData.length > 0) {
			writeFileSync(
				join(profileImagesDir, `${user.UserId}.png`),
				user.ImageData,
			);
		}
	}

	writeJson(
		'users',
		users.map((u) => ({
			id: u.UserId,
			username: str(u.Username),
			role: u.Role,
			name: str(u.Name),
			websiteUrl: str(u.WebsiteUrl),
			aboutMe: str(u.AboutMe),
			hasImage: u.ImageData instanceof Buffer && u.ImageData.length > 0,
			creationDate: u.CreationDate,
		})),
	);
};

main();
