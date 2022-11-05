import { Hashtag } from '@/entities/Hashtag';
import { HashtagLink } from '@/entities/HashtagLink';
import { User } from '@/entities/User';
import { HashtagLinkUpdateParams } from '@/models/HashtagLinkUpdateParams';
import { IEntryWithHashtagLinks } from '@/models/IEntryWithHashtagLinks';
import { Permission } from '@/models/Permission';
import { PermissionContext } from '@/services/PermissionContext';
import { collectionSyncWithContent } from '@/utils/collectionDiff';
import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashtagLinkService {
	private async getOrCreateHashtag(
		em: EntityManager,
		name: string,
		actor: User,
	): Promise<Hashtag> {
		const hashtag =
			(await em.findOne(Hashtag, {
				name: name,
				// REVIEW
				deleted: false,
				hidden: false,
			})) ?? new Hashtag(name, actor);

		em.persist(hashtag);

		return hashtag;
	}

	async sync<THashtagLink extends HashtagLink>(
		em: EntityManager,
		entry: IEntryWithHashtagLinks<THashtagLink>,
		newItems: HashtagLinkUpdateParams[],
		permissionContext: PermissionContext,
		actor: User,
	): Promise<void> {
		const create = async (
			newItem: HashtagLinkUpdateParams,
		): Promise<THashtagLink> => {
			permissionContext.verifyPermission(Permission.CreateHashtagLinks);

			const hashtag = await this.getOrCreateHashtag(
				em,
				newItem.name,
				actor,
			);

			hashtag.incrementReferenceCount();

			return entry.createHashtagLink(hashtag, newItem.label);
		};

		const update = async (
			oldItem: THashtagLink,
			newItem: HashtagLinkUpdateParams,
		): Promise<boolean> => {
			if (oldItem.contentEquals(newItem)) return false;

			permissionContext.verifyPermission(Permission.UpdateHashtagLinks);

			const hashtag = await this.getOrCreateHashtag(
				em,
				newItem.name,
				actor,
			);

			oldItem.setRelatedHashtag(hashtag);
			oldItem.label = newItem.label;

			return true;
		};

		const remove = async (oldItem: THashtagLink): Promise<void> => {
			permissionContext.verifyPermission(Permission.DeleteHashtagLinks);

			oldItem.relatedHashtag.getEntity().decrementReferenceCount();

			em.remove(oldItem);
		};

		await collectionSyncWithContent(
			entry.hashtagLinks.getItems(),
			newItems,
			(oldItem, newItem) => oldItem.id === newItem.id,
			create,
			update,
			remove,
		);
	}
}
