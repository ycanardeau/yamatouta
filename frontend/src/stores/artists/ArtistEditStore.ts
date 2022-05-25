import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { artistApi } from '../../api/artistApi';
import { IArtistObject } from '../../dto/IArtistObject';
import { ArtistType } from '../../models/artists/ArtistType';
import { WebLinkListEditStore } from '../WebLinkListEditStore';

export class ArtistEditStore {
	@observable submitting = false;
	@observable name = '';
	@observable artistType = ArtistType.Person;
	readonly webLinks: WebLinkListEditStore;

	constructor(private readonly artist?: IArtistObject) {
		makeObservable(this);

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

			const createOrUpdate = this.artist
				? artistApi.update
				: artistApi.create;

			// Await.
			const artist = await createOrUpdate({
				id: this.artist?.id ?? 0,
				name: this.name,
				artistType: this.artistType,
				webLinks: this.webLinks.items,
			});

			return artist;
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
