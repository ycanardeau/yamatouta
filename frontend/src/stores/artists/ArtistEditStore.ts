import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { createArtist, updateArtist } from '../../api/ArtistApi';
import { IArtistObject } from '../../dto/artists/IArtistObject';
import { ArtistType } from '../../models/ArtistType';
import { WebLinkListEditStore } from '../WebLinkListEditStore';

export class ArtistEditStore {
	private readonly artist?: IArtistObject;
	@observable submitting = false;
	@observable name = '';
	@observable artistType = ArtistType.Person;
	readonly webLinks: WebLinkListEditStore;

	constructor(artist?: IArtistObject) {
		makeObservable(this);

		this.artist = artist;

		if (artist) {
			this.name = artist.name;
			this.artistType = artist.artistType;
			this.webLinks = new WebLinkListEditStore(artist.webLinks);
		} else {
			this.webLinks = new WebLinkListEditStore([]);
		}
	}

	@computed get isValid(): boolean {
		return !!this.name && !!this.artistType;
	}

	@action setName = (value: string): void => {
		this.name = value;
	};

	@action setArtistType = (value: ArtistType): void => {
		this.artistType = value;
	};

	@action submit = async (): Promise<IArtistObject> => {
		try {
			this.submitting = true;

			const params = {
				name: this.name,
				artistType: this.artistType,
				webLinks: this.webLinks.items,
			};

			// Await.
			const artist = await (this.artist
				? updateArtist({ ...params, artistId: this.artist.id })
				: createArtist(params));

			return artist;
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
