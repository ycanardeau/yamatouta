import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { createArtist } from '../api/ArtistApi';
import { IArtistObject } from '../dto/artists/IArtistObject';
import { ArtistType } from '../models/ArtistType';

export class CreateArtistDialogStore {
	@observable submitting = false;
	@observable name = '';
	@observable artistType = ArtistType.Person;

	constructor() {
		makeObservable(this);
	}

	@computed get isValid(): boolean {
		return (
			!!this.name.trim() &&
			Object.values(ArtistType).includes(this.artistType)
		);
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

			// Await.
			const artist = await createArtist({
				name: this.name,
				artistType: this.artistType,
			});

			return artist;
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
