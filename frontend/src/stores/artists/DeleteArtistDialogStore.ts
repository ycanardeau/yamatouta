import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { deleteArtist } from '../../api/ArtistApi';
import { IArtistObject } from '../../dto/artists/IArtistObject';

export class DeleteArtistDialogStore {
	private readonly artist: IArtistObject;
	@observable submitting = false;

	constructor({ artist }: { artist: IArtistObject }) {
		makeObservable(this);

		this.artist = artist;
	}

	@computed get isValid(): boolean {
		return true;
	}

	@action submit = async (): Promise<void> => {
		try {
			this.submitting = true;

			await deleteArtist({ artistId: this.artist.id });
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
