import config from '@/config';
import { Artist } from '@/entities/Artist';
import { Hashtag } from '@/entities/Hashtag';
import { Quote } from '@/entities/Quote';
import { Translation } from '@/entities/Translation';
import { Work } from '@/entities/Work';
import { Entry } from '@/models/Entry';
import { EntryUrlMapper } from '@/models/EntryUrlMapper';
import { Permission } from '@/models/Permission';
import { PermissionContext } from '@/services/PermissionContext';
import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { createWriteStream, promises, WriteStream } from 'fs';
import { resolve } from 'path';
import {
	IndexItem,
	SitemapAndIndexStream,
	SitemapItemLoose,
	SitemapStream,
} from 'sitemap';

@Injectable()
export class SitemapService {
	constructor(private readonly em: EntityManager) {}

	async generate(permissionContext: PermissionContext): Promise<void> {
		permissionContext.verifyPermission(Permission.GenerateSitemaps);

		const destinationDir = resolve(config.clientBuildPath, 'sitemaps');

		await promises.mkdir(destinationDir, { recursive: true });

		const sms = new SitemapAndIndexStream({
			limit: 50000,
			getSitemapStream: (
				i: number,
			): [IndexItem | string, SitemapStream, WriteStream] => {
				const sitemapStream = new SitemapStream({
					hostname: 'https://yamatouta.net',
				});
				const path = `./sitemap-${i}.xml`;

				const ws = sitemapStream.pipe(
					createWriteStream(resolve(destinationDir, path)),
				);

				return [
					new URL(path, 'https://yamatouta.net/sitemaps/').toString(),
					sitemapStream,
					ws,
				];
			},
		});

		sms.pipe(
			createWriteStream(
				resolve(
					config.clientBuildPath,
					'sitemaps',
					'./sitemap-index.xml',
				),
			),
		);

		const [artists, hashtags, quotes, translations, works] =
			await Promise.all([
				this.em.find(
					Artist,
					{ deleted: false, hidden: false },
					{ fields: ['id', 'updatedAt'] },
				),
				this.em.find(
					Hashtag,
					{ deleted: false, hidden: false },
					{ fields: ['name', 'updatedAt'] },
				),
				this.em.find(
					Quote,
					{ deleted: false, hidden: false },
					{ fields: ['id', 'updatedAt'] },
				),
				this.em.find(
					Translation,
					{ deleted: false, hidden: false },
					{ fields: ['id', 'updatedAt'] },
				),
				this.em.find(
					Work,
					{ deleted: false, hidden: false },
					{ fields: ['id', 'updatedAt'] },
				),
			]);

		const items: SitemapItemLoose[] = ([] as Entry[])
			.concat(artists)
			.concat(quotes)
			.concat(translations)
			.concat(works)
			.map((entry) => ({
				url: EntryUrlMapper.details(entry),
				lastmodISO: entry.updatedAt.toISOString(),
			}));

		for (const item of items) sms.write(item);

		for (const hashtag of hashtags) {
			sms.write({
				url: `/hashtags/${encodeURIComponent(hashtag.name)}/quotes`,
				lastmodISO: hashtag.updatedAt.toISOString(),
			});
		}

		sms.end();
	}
}
