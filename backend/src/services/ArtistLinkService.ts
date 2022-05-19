import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { Artist } from '../entities/Artist';
import { ArtistLink } from '../entities/ArtistLink';
import { LinkType } from '../entities/LinkType';
import { PartialDate } from '../entities/PartialDate';
import { ArtistLinkUpdateParams } from '../models/ArtistLinkUpdateParams';
import { IArtistLinkFactory } from '../models/IArtistLinkFactory';
import { IEntryWithArtistLinks } from '../models/IEntryWithArtistLinks';
import { Permission } from '../models/Permission';
import { collectionSyncWithContent } from '../utils/collectionDiff';
import { PermissionContext } from './PermissionContext';

@Injectable()
export class ArtistLinkService {
	async sync<TArtistLink extends ArtistLink>(
		em: EntityManager,
		entry: IEntryWithArtistLinks<TArtistLink> &
			IArtistLinkFactory<TArtistLink>,
		newItems: ArtistLinkUpdateParams[],
		permissionContext: PermissionContext,
	): Promise<void> {
		const create = async (
			newItem: ArtistLinkUpdateParams,
		): Promise<TArtistLink> => {
			permissionContext.verifyPermission(Permission.ArtistLink_Create);

			const [relatedArtist, linkType] = await Promise.all([
				em.findOneOrFail(Artist, {
					id: newItem.relatedArtistId,
					deleted: false,
					hidden: false,
				}),
				em.findOneOrFail(LinkType, {
					id: newItem.linkTypeId,
				}),
			]);

			return entry.createArtistLink({
				relatedArtist: relatedArtist,
				linkType: linkType,
				beginDate: new PartialDate() /* TODO */,
				endDate: new PartialDate() /* TODO */,
				ended: newItem.ended,
			});
		};

		const update = async (
			oldItem: TArtistLink,
			newItem: ArtistLinkUpdateParams,
		): Promise<boolean> => {
			if (oldItem.contentEquals(newItem)) return false;

			permissionContext.verifyPermission(Permission.ArtistLink_Update);

			oldItem.relatedArtistId = newItem.relatedArtistId;
			oldItem.linkTypeId = newItem.linkTypeId;

			return true;
		};

		const remove = async (oldItem: TArtistLink): Promise<void> => {
			permissionContext.verifyPermission(Permission.ArtistLink_Delete);

			em.remove(oldItem);
		};

		await collectionSyncWithContent(
			entry.artistLinks.getItems(),
			newItems.filter(
				(newItem) => newItem.relatedArtistId && newItem.linkTypeId,
			),
			(oldItem, newItem) => oldItem.id === newItem.id,
			create,
			update,
			remove,
		);
	}
}
