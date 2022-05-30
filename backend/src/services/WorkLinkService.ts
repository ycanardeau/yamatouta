import { EntityManager } from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';

import { PartialDate } from '../entities/PartialDate';
import { Work } from '../entities/Work';
import { WorkLink } from '../entities/WorkLink';
import { IEntryWithWorkLinks } from '../models/IEntryWithWorkLinks';
import { IWorkLinkFactory } from '../models/IWorkLinkFactory';
import { LinkType, workLinkTypes } from '../models/LinkType';
import { Permission } from '../models/Permission';
import { WorkLinkUpdateParams } from '../models/WorkLinkUpdateParams';
import { collectionSyncWithContent } from '../utils/collectionDiff';
import { PermissionContext } from './PermissionContext';

// TODO: Add unit tests.
@Injectable()
export class WorkLinkService {
	async sync<TWorkLink extends WorkLink>(
		em: EntityManager,
		entry: {
			entryType: keyof typeof workLinkTypes;
		} & IEntryWithWorkLinks<TWorkLink> &
			IWorkLinkFactory<TWorkLink>,
		newItems: WorkLinkUpdateParams[],
		permissionContext: PermissionContext,
	): Promise<void> {
		const create = async (
			newItem: WorkLinkUpdateParams,
		): Promise<TWorkLink> => {
			permissionContext.verifyPermission(Permission.WorkLink_Create);

			const relatedWork = await em.findOneOrFail(Work, {
				id: newItem.relatedWorkId,
				deleted: false,
				hidden: false,
			});

			if (!workLinkTypes[entry.entryType].includes(newItem.linkType))
				throw new BadRequestException('Invalid link type');

			return entry.createWorkLink({
				relatedWork: relatedWork,
				linkType: newItem.linkType,
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
				(newItem) =>
					newItem.relatedWorkId &&
					newItem.linkType !== LinkType.Unspecified,
			),
			(oldItem, newItem) => oldItem.id === newItem.id,
			create,
			update,
			remove,
		);
	}
}
