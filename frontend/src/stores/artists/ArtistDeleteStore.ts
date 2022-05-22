import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { artistApi } from '../../api/artistApi';
import { IArtistObject } from '../../dto/IArtistObject';

export class ArtistDeleteStore {
	@observable submitting = false;

	constructor(private readonly artist: IArtistObject) {
		makeObservable(this);
	}

	@computed get isValid(): boolean {
		return true;
	}

	@action submit = async (): Promise<void> => {
		try {
			this.submitting = true;

			await artistApi.delete({ id: this.artist.id });
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
