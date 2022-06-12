import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { artistApi } from '../../api/artistApi';
import { ArtistEditObject } from '../../dto/ArtistEditObject';
import { IArtistObject } from '../../dto/IArtistObject';
import { ArtistType } from '../../models/artists/ArtistType';
import { IArtistUpdateParams } from '../../models/artists/IArtistUpdateParams';
import { HashtagLinkListEditStore } from '../HashtagLinkListEditStore';
import { WebLinkListEditStore } from '../WebLinkListEditStore';

export class ArtistEditStore {
	@observable submitting = false;
	@observable name = '';
	@observable artistType = ArtistType.Person;
	readonly hashtagLinks: HashtagLinkListEditStore;
	readonly webLinks: WebLinkListEditStore;

	constructor(private readonly artist?: ArtistEditObject) {
		makeObservable(this);

		if (artist) {
			this.name = artist.name;
			this.artistType = artist.artistType;
			this.hashtagLinks = new HashtagLinkListEditStore(
				artist.hashtagLinks,
			);
			this.webLinks = new WebLinkListEditStore(artist.webLinks);
		} else {
			this.hashtagLinks = new HashtagLinkListEditStore([]);
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

	toParams = (): IArtistUpdateParams => {
		return {
			id: this.artist?.id ?? 0,
			name: this.name,
			artistType: this.artistType,
			hashtagLinks: this.hashtagLinks.toParams(),
			webLinks: this.webLinks.toParams(),
		};
	};

	@action submit = async (): Promise<IArtistObject> => {
		try {
			this.submitting = true;

			const createOrUpdate = this.artist
				? artistApi.update
				: artistApi.create;

			// Await.
			const artist = await createOrUpdate(this.toParams());

			return artist;
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
