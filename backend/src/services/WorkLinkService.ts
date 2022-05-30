import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { LinkType } from '../entities/LinkType';
import { PartialDate } from '../entities/PartialDate';
import { Work } from '../entities/Work';
import { WorkLink } from '../entities/WorkLink';
import { EntryType } from '../models/EntryType';
import { IEntryWithWorkLinks } from '../models/IEntryWithWorkLinks';
import { IWorkLinkFactory } from '../models/IWorkLinkFactory';
import { Permission } from '../models/Permission';
import { WorkLinkUpdateParams } from '../models/WorkLinkUpdateParams';
import { collectionSyncWithContent } from '../utils/collectionDiff';
import { PermissionContext } from './PermissionContext';

// TODO: Add unit tests.
@Injectable()
export class WorkLinkService {
	async sync<TWorkLink extends WorkLink>(
		em: EntityManager,
		entry: { entryType: EntryType } & IEntryWithWorkLinks<TWorkLink> &
			IWorkLinkFactory<TWorkLink>,
		newItems: WorkLinkUpdateParams[],
		permissionContext: PermissionContext,
	): Promise<void> {
		const create = async (
			newItem: WorkLinkUpdateParams,
		): Promise<TWorkLink> => {
			permissionContext.verifyPermission(Permission.WorkLink_Create);

			const [relatedWork, linkType] = await Promise.all([
				em.findOneOrFail(Work, {
					id: newItem.relatedWorkId,
					deleted: false,
					hidden: false,
				}),
				em.findOneOrFail(LinkType, {
					id: newItem.linkTypeId,
					entryType: entry.entryType,
					relatedEntryType: EntryType.Work,
				}),
			]);

			return entry.createWorkLink({
				relatedWork: relatedWork,
				linkType: linkType,
				beginDate: new PartialDate() /* TODO */,
				endDate: new PartialDate() /* TODO */,
				ended: newItem.ended,
			});
		};

		const update = async (
			oldItem: TWorkLink,
			newItem: WorkLinkUpdateParams,
		): Promise<boolean> => {
			if (oldItem.contentEquals(newItem)) return false;

			permissionContext.verifyPermission(Permission.WorkLink_Update);

			oldItem.relatedWorkId = newItem.relatedWorkId;

			return true;
		};

		const remove = async (oldItem: TWorkLink): Promise<void> => {
			permissionContext.verifyPermission(Permission.WorkLink_Delete);

			em.remove(oldItem);
		};

		await collectionSyncWithContent(
			entry.workLinks.getItems(),
			newItems.filter(
				(newItem) => newItem.relatedWorkId && newItem.linkTypeId,
			),
			(oldItem, newItem) => oldItem.id === newItem.id,
			create,
			update,
			remove,
		);
	}
}
