import { EntityManager, QueryOrder } from '@mikro-orm/core';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Artist } from '../../../entities/Artist';
import { Commit } from '../../../entities/Commit';
import { Quote } from '../../../entities/Quote';
import { Translation } from '../../../entities/Translation';
import { Work } from '../../../entities/Work';
import { EntryWithRevisions } from '../../../models/Entry';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { PermissionContext } from '../../../services/PermissionContext';
import { ArtistUpdateCommandHandler } from '../artists/ArtistUpdateCommandHandler';
import { QuoteUpdateCommandHandler } from '../quotes/QuoteUpdateCommandHandler';
import { TranslationUpdateCommandHandler } from '../translations/TranslationUpdateCommandHandler';
import { WorkUpdateCommandHandler } from '../works/WorkUpdateCommandHandler';

export class AdminCreateMissingRevisionsCommand {
	constructor(readonly permissionContext: PermissionContext) {}
}

@CommandHandler(AdminCreateMissingRevisionsCommand)
export class AdminCreateMissingRevisionsCommandHandler
	implements ICommandHandler<AdminCreateMissingRevisionsCommand>
{
	private static readonly chunkSize = 1000;

	constructor(private readonly em: EntityManager) {}

	async execute(command: AdminCreateMissingRevisionsCommand): Promise<void> {
		const { permissionContext } = command;

		permissionContext.verifyPermission(Permission.CreateMissingRevisions);

		let entryId = 1;

		while (true) {
			const em = this.em.fork();
			await em.begin();

			try {
				const [artists, quotes, translations, works] =
					await Promise.all([
						em.find(
							Artist,
							{ id: { $gte: entryId }, version: 0 },
							{
								populate: [
									...ArtistUpdateCommandHandler.populate,
									'actor',
								],
								limit: AdminCreateMissingRevisionsCommandHandler.chunkSize,
								orderBy: { id: QueryOrder.asc },
							},
						),
						em.find(
							Quote,
							{ id: { $gte: entryId }, version: 0 },
							{
								populate: [
									...QuoteUpdateCommandHandler.populate,
									'actor',
								],
								limit: AdminCreateMissingRevisionsCommandHandler.chunkSize,
								orderBy: { id: QueryOrder.asc },
							},
						),
						em.find(
							Translation,
							{ id: { $gte: entryId }, version: 0 },
							{
								populate: [
									...TranslationUpdateCommandHandler.populate,
									'actor',
								],
								limit: AdminCreateMissingRevisionsCommandHandler.chunkSize,
								orderBy: { id: QueryOrder.asc },
							},
						),
						em.find(
							Work,
							{ id: { $gte: entryId }, version: 0 },
							{
								populate: [
									...WorkUpdateCommandHandler.populate,
									'actor',
								],
								limit: AdminCreateMissingRevisionsCommandHandler.chunkSize,
								orderBy: { id: QueryOrder.asc },
							},
						),
					]);

				const entries = ([] as EntryWithRevisions[])
					.concat(artists)
					.concat(quotes)
					.concat(translations)
					.concat(works);

				if (entries.length === 0) break;

				for (const entry of entries) {
					const commit = new Commit();

					const revision = entry.createRevision(
						commit,
						entry.actor.getEntity(),
						RevisionEvent.Created,
						'',
						++entry.version,
					);
					revision.createdAt = entry.createdAt;

					em.persist(revision);
				}

				await em.commit();

				entryId += AdminCreateMissingRevisionsCommandHandler.chunkSize;
			} catch (e) {
				await em.rollback();
				throw e;
			}
		}
	}
}
