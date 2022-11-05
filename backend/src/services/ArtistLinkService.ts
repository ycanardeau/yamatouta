import { Artist } from '@/entities/Artist';
import { ArtistLink } from '@/entities/ArtistLink';
import { PartialDate } from '@/entities/PartialDate';
import { ArtistLinkUpdateParams } from '@/models/ArtistLinkUpdateParams';
import { IEntryWithArtistLinks } from '@/models/IEntryWithArtistLinks';
import { artistLinkTypes } from '@/models/LinkType';
import { Permission } from '@/models/Permission';
import { PermissionContext } from '@/services/PermissionContext';
import { collectionSyncWithContent } from '@/utils/collectionDiff';
import { EntityManager, Reference } from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ArtistLinkService {
	async sync<
		TEntryType extends keyof typeof artistLinkTypes,
		TArtistLink extends ArtistLink,
	>(
		em: EntityManager,
		entry: IEntryWithArtistLinks<TEntryType, TArtistLink>,
		newItems: ArtistLinkUpdateParams[],
		permissionContext: PermissionContext,
	): Promise<void> {
		const create = async (
			newItem: ArtistLinkUpdateParams,
		): Promise<TArtistLink> => {
			permissionContext.verifyPermission(Permission.CreateArtistLinks);

			const relatedArtist = await em.findOneOrFail(Artist, {
				id: newItem.relatedArtistId,
			});

			permissionContext.verifyDeletedAndHidden(relatedArtist);

			if (!artistLinkTypes[entry.entryType].includes(newItem.linkType))
				throw new BadRequestException('Invalid link type');

			return entry.createArtistLink(
				relatedArtist,
				newItem.linkType,
				PartialDate.create(newItem.beginDate),
				PartialDate.create(newItem.endDate),
				newItem.ended,
			);
		};

		const update = async (
			oldItem: TArtistLink,
			newItem: ArtistLinkUpdateParams,
		): Promise<boolean> => {
			if (oldItem.contentEquals(newItem)) return false;

			permissionContext.verifyPermission(Permission.UpdateArtistLinks);

			const relatedArtist = await em.findOneOrFail(Artist, {
				id: newItem.relatedArtistId,
			});

			permissionContext.verifyDeletedAndHidden(relatedArtist);

			if (!artistLinkTypes[entry.entryType].includes(newItem.linkType))
				throw new BadRequestException('Invalid link type');

			oldItem.relatedArtist = Reference.create(relatedArtist);
			oldItem.linkType = newItem.linkType;

			return true;
		};

		const remove = async (oldItem: TArtistLink): Promise<void> => {
			permissionContext.verifyPermission(Permission.DeleteArtistLinks);

			em.remove(oldItem);
		};

		await collectionSyncWithContent(
			entry.artistLinks.getItems(),
			newItems,
			(oldItem, newItem) => oldItem.id === newItem.id,
			create,
			update,
			remove,
		);
	}
}
