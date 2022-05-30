import { action, makeObservable, observable } from 'mobx';

import { artistApi } from '../api/artistApi';
import { IArtistObject } from '../dto/IArtistObject';
import { IArtistLinkObject } from '../dto/ILinkObject';
import { IArtistLinkUpdateParams } from '../models/IArtistLinkUpdateParams';
import { LinkType } from '../models/LinkType';
import { BasicEntryLinkStore } from './BasicEntryLinkStore';
import { BasicListEditStore } from './BasicListEditStore';

export class ArtistLinkEditStore {
	readonly relatedArtist = new BasicEntryLinkStore<IArtistObject>((id) =>
		artistApi.get({ id: id }),
	);
	@observable linkType = LinkType.Work_Artist_Author;
	//readonly beginDate: PartialDateEditStore;
	//readonly endDate: PartialDateEditStore;
	@observable ended = false;

	constructor(private readonly artistLink?: IArtistLinkObject) {
		makeObservable(this);

		if (artistLink) {
			this.relatedArtist.loadEntryById(artistLink.relatedArtist.id);
			this.linkType = artistLink.linkType;
			this.ended = artistLink.ended;
		}
	}

	@action setLinkType = (value: LinkType): void => {
		this.linkType = value;
	};

	toParams = (): IArtistLinkUpdateParams => {
		return {
			id: this.artistLink?.id ?? 0,
			relatedArtistId: this.relatedArtist.entry?.id ?? 0,
			linkType: this.linkType,
			beginDate: {} /* TODO */,
			endDate: {} /* TODO */,
			ended: this.ended,
		};
	};
}

export class ArtistLinkListEditStore extends BasicListEditStore<
	ArtistLinkEditStore,
	IArtistLinkObject
> {
	constructor(objects: IArtistLinkObject[]) {
		super(ArtistLinkEditStore, objects);
	}

	toParams = (): IArtistLinkUpdateParams[] => {
		return this.items.map((item) => item.toParams());
	};
}
