import { makeObservable, observable } from 'mobx';

import { artistApi } from '../api/artistApi';
import { linkApi } from '../api/linkApi';
import { IArtistObject } from '../dto/IArtistObject';
import { IArtistLinkObject } from '../dto/ILinkObject';
import { ILinkTypeObject } from '../dto/ILinkTypeObject';
import { IArtistLinkUpdateParams } from '../models/IArtistLinkUpdateParams';
import { BasicEntryLinkStore } from './BasicEntryLinkStore';
import { BasicListEditStore } from './BasicListEditStore';

export class ArtistLinkEditStore {
	readonly linkType = new BasicEntryLinkStore<ILinkTypeObject>((id) =>
		linkApi.getType({ id: id }),
	);
	readonly relatedArtist = new BasicEntryLinkStore<IArtistObject>((id) =>
		artistApi.get({ id: id }),
	);
	//readonly beginDate: PartialDateEditStore;
	//readonly endDate: PartialDateEditStore;
	@observable ended = false;

	constructor(private readonly artistLink?: IArtistLinkObject) {
		makeObservable(this);

		if (artistLink) {
			this.linkType.loadEntryById(artistLink.linkType.id);
			this.relatedArtist.loadEntryById(artistLink.relatedArtist.id);
			this.ended = artistLink.ended;
		}
	}

	toParams = (): IArtistLinkUpdateParams => {
		return {
			id: this.artistLink?.id ?? 0,
			linkTypeId: this.linkType.entry?.id ?? 0,
			relatedArtistId: this.relatedArtist.entry?.id ?? 0,
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
