import { EntityManager } from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';

import { Artist } from '../entities/Artist';
import { ArtistLink } from '../entities/ArtistLink';
import { PartialDate } from '../entities/PartialDate';
import { ArtistLinkUpdateParams } from '../models/ArtistLinkUpdateParams';
import { IArtistLinkFactory } from '../models/IArtistLinkFactory';
import { IEntryWithArtistLinks } from '../models/IEntryWithArtistLinks';
import { artistLinkTypes } from '../models/LinkType';
import { Permission } from '../models/Permission';
import { collectionSyncWithContent } from '../utils/collectionDiff';
import { PermissionContext } from './PermissionContext';

// TODO: Add unit tests.
@Injectable()
export class ArtistLinkService {
	async sync<TArtistLink extends ArtistLink>(
		em: EntityManager,
		entry: {
			entryType: keyof typeof artistLinkTypes;
		} & IEntryWithArtistLinks<TArtistLink> &
			IArtistLinkFactory<TArtistLink>,
		newItems: ArtistLinkUpdateParams[],
		permissionContext: PermissionContext,
	): Promise<void> {
		const create = async (
			newItem: ArtistLinkUpdateParams,
		): Promise<TArtistLink> => {
			permissionContext.verifyPermission(Permission.ArtistLink_Create);

			const relatedArtist = await em.findOneOrFail(Artist, {
				id: newItem.relatedArtistId,
				deleted: false,
				hidden: false,
			});

			if (!artistLinkTypes[entry.entryType].includes(newItem.linkType))
				throw new BadRequestException('Invalid link type');

			return entry.createArtistLink({
				relatedArtist: relatedArtist,
				linkType: newItem.linkType,
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
			oldItem.linkType = newItem.linkType;

			return true;
		};

		const remove = async (oldItem: TArtistLink): Promise<void> => {
			permissionContext.verifyPermission(Permission.ArtistLink_Delete);

			em.remove(oldItem);
		};

		await collectionSyncWithContent(
			entry.artistLinks.getItems(),
			newItems.filter(
				(newItem) => newItem.relatedArtistId && newItem.linkType,
			),
			(oldItem, newItem) => oldItem.id === newItem.id,
			create,
			update,
			remove,
		);
	}
}
