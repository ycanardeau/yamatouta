import { EntityManager, FilterQuery, QueryOrder } from '@mikro-orm/core';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ArtistSearchIndex } from '../../../entities/Artist';
import { QuoteSearchIndex } from '../../../entities/Quote';
import { TranslationSearchIndex } from '../../../entities/Translation';
import { UserSearchIndex } from '../../../entities/User';
import { WorkSearchIndex } from '../../../entities/Work';
import { EntrySearchIndex } from '../../../models/Entry';
import { Permission } from '../../../models/Permission';
import { AdminUpdateSearchIndexParams } from '../../../models/admin/AdminUpdateSearchIndexParams';
import { NgramConverter } from '../../../services/NgramConverter';
import { PermissionContext } from '../../../services/PermissionContext';

export class AdminUpdateSearchIndexCommand {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: AdminUpdateSearchIndexParams,
	) {}
}

@CommandHandler(AdminUpdateSearchIndexCommand)
export class AdminUpdateSearchIndexCommandHandler
	implements ICommandHandler<AdminUpdateSearchIndexCommand>
{
	private static readonly chunkSize = 1000;

	constructor(
		private readonly em: EntityManager,
		private readonly ngramConverter: NgramConverter,
	) {}

	async execute(command: AdminUpdateSearchIndexCommand): Promise<void> {
		const { permissionContext, params } = command;

		permissionContext.verifyPermission(Permission.Admin_UpdateSearchIndex);

		let entryId = 1;

		while (true) {
			const em = this.em.fork();
			await em.begin();

			try {
				const [artists, quotes, translations, users, works] =
					await Promise.all([
						em.find(
							ArtistSearchIndex,
							{
								$and: (
									[
										{ id: { $gte: entryId } },
									] as FilterQuery<ArtistSearchIndex>[]
								).concat(
									params.forceUpdate ? [] : { name: '' },
								),
							},
							{
								populate: ['artist', 'name'],
								limit: AdminUpdateSearchIndexCommandHandler.chunkSize,
								orderBy: { id: QueryOrder.asc },
							},
						),
						em.find(
							QuoteSearchIndex,
							{
								$and: (
									[
										{ id: { $gte: entryId } },
									] as FilterQuery<QuoteSearchIndex>[]
								).concat(
									params.forceUpdate ? [] : { text: '' },
								),
							},
							{
								populate: ['quote', 'text'],
								limit: AdminUpdateSearchIndexCommandHandler.chunkSize,
								orderBy: { id: QueryOrder.asc },
							},
						),
						em.find(
							TranslationSearchIndex,
							{
								$and: (
									[
										{ id: { $gte: entryId } },
									] as FilterQuery<TranslationSearchIndex>[]
								).concat(
									params.forceUpdate
										? []
										: {
												headword: '',
												reading: '',
												yamatokotoba: '',
										  },
								),
							},
							{
								populate: [
									'translation',
									'headword',
									'reading',
									'yamatokotoba',
								],
								limit: AdminUpdateSearchIndexCommandHandler.chunkSize,
								orderBy: { id: QueryOrder.asc },
							},
						),
						em.find(
							UserSearchIndex,
							{
								$and: (
									[
										{ id: { $gte: entryId } },
									] as FilterQuery<UserSearchIndex>[]
								).concat(
									params.forceUpdate ? [] : { name: '' },
								),
							},
							{
								populate: ['user', 'name'],
								limit: AdminUpdateSearchIndexCommandHandler.chunkSize,
								orderBy: { id: QueryOrder.asc },
							},
						),
						em.find(
							WorkSearchIndex,
							{
								$and: (
									[
										{ id: { $gte: entryId } },
									] as FilterQuery<WorkSearchIndex>[]
								).concat(
									params.forceUpdate ? [] : { name: '' },
								),
							},
							{
								populate: ['work', 'name'],
								limit: AdminUpdateSearchIndexCommandHandler.chunkSize,
								orderBy: { id: QueryOrder.asc },
							},
						),
					]);

				const entries = ([] as EntrySearchIndex[])
					.concat(artists as EntrySearchIndex[])
					.concat(quotes as EntrySearchIndex[])
					.concat(translations as EntrySearchIndex[])
					.concat(users as EntrySearchIndex[])
					.concat(works as EntrySearchIndex[]);

				if (entries.length === 0) break;

				for (const entry of entries)
					entry.entry.updateSearchIndex(this.ngramConverter);

				await em.commit();

				entryId += AdminUpdateSearchIndexCommandHandler.chunkSize;
			} catch (e) {
				await em.rollback();
				throw e;
			}
		}
	}
}
