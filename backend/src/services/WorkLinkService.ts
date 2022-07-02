import { EntityManager, Reference } from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';

import { PartialDate } from '../entities/PartialDate';
import { Work } from '../entities/Work';
import { WorkLink } from '../entities/WorkLink';
import { IEntryWithWorkLinks } from '../models/IEntryWithWorkLinks';
import { workLinkTypes } from '../models/LinkType';
import { Permission } from '../models/Permission';
import { WorkLinkUpdateParams } from '../models/WorkLinkUpdateParams';
import { collectionSyncWithContent } from '../utils/collectionDiff';
import { PermissionContext } from './PermissionContext';

@Injectable()
export class WorkLinkService {
	async sync<
		TEntryType extends keyof typeof workLinkTypes,
		TWorkLink extends WorkLink,
	>(
		em: EntityManager,
		entry: IEntryWithWorkLinks<TEntryType, TWorkLink>,
		newItems: WorkLinkUpdateParams[],
		permissionContext: PermissionContext,
	): Promise<void> {
		const create = async (
			newItem: WorkLinkUpdateParams,
		): Promise<TWorkLink> => {
			permissionContext.verifyPermission(Permission.CreateWorkLinks);

			const relatedWork = await em.findOneOrFail(Work, {
				id: newItem.relatedWorkId,
			});

			permissionContext.verifyDeletedAndHidden(relatedWork);

			if (!workLinkTypes[entry.entryType].includes(newItem.linkType))
				throw new BadRequestException('Invalid link type');

			return entry.createWorkLink(
				relatedWork,
				newItem.linkType,
				PartialDate.create(newItem.beginDate),
				PartialDate.create(newItem.endDate),
				newItem.ended,
			);
		};

		const update = async (
			oldItem: TWorkLink,
			newItem: WorkLinkUpdateParams,
		): Promise<boolean> => {
			if (oldItem.contentEquals(newItem)) return false;

			permissionContext.verifyPermission(Permission.UpdateWorkLinks);

			const relatedWork = await em.findOneOrFail(Work, {
				id: newItem.relatedWorkId,
			});

			permissionContext.verifyDeletedAndHidden(relatedWork);

			if (!workLinkTypes[entry.entryType].includes(newItem.linkType))
				throw new BadRequestException('Invalid link type');

			oldItem.relatedWork = Reference.create(relatedWork);
			oldItem.linkType = newItem.linkType;

			return true;
		};

		const remove = async (oldItem: TWorkLink): Promise<void> => {
			permissionContext.verifyPermission(Permission.DeleteWorkLinks);

			em.remove(oldItem);
		};

		await collectionSyncWithContent(
			entry.workLinks.getItems(),
			newItems,
			(oldItem, newItem) => oldItem.id === newItem.id,
			create,
			update,
			remove,
		);
	}
}
