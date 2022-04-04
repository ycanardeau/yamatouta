import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { IArtistObject } from '../../dto/artists/IArtistObject';
import { ArtistType } from '../../models/ArtistType';

export class EditArtistDialogStore {
	private readonly artist?: IArtistObject;
	@observable submitting = false;
	@observable name = '';
	@observable artistType = ArtistType.Person;

	constructor({ artist }: { artist?: IArtistObject }) {
		makeObservable(this);

		this.artist = artist;
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

			// TODO: Implement.
			throw new Error();
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
