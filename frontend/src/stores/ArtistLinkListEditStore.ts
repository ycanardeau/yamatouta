import { makeObservable, observable } from 'mobx';

import { artistApi } from '../api/artistApi';
import { linkApi } from '../api/linkApi';
import { IArtistLinkObject } from '../dto/IArtistLinkObject';
import { IArtistObject } from '../dto/IArtistObject';
import { ILinkTypeObject } from '../dto/ILinkTypeObject';
import { BasicEntryLinkStore } from './BasicEntryLinkStore';
import { BasicListEditStore } from './BasicListEditStore';

export class ArtistLinkEditStore {
	readonly linkType = new BasicEntryLinkStore<ILinkTypeObject>((entryId) =>
		linkApi.getType({ id: entryId }),
	);
	readonly artist = new BasicEntryLinkStore<IArtistObject>((entryId) =>
		artistApi.get({ id: entryId }),
	);
	@observable ended = false;

	constructor(artistLink?: IArtistLinkObject) {
		makeObservable(this);

		if (artistLink) {
			this.artist.loadEntryById(artistLink.artist.id);
			this.ended = artistLink.link.ended;
		}
	}
}

export class ArtistLinkListEditStore extends BasicListEditStore<
	ArtistLinkEditStore,
	IArtistLinkObject
> {
	constructor(objects: IArtistLinkObject[]) {
		super(ArtistLinkEditStore, objects);
	}
}
