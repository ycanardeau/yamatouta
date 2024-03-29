import { artistApi } from '@/api/artistApi';
import { IArtistDto } from '@/dto/IArtistDto';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

export class ArtistDeleteStore {
	@observable submitting = false;

	constructor(private readonly artist: IArtistDto) {
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
