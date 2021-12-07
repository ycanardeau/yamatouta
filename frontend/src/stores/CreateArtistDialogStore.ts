import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { createArtist } from '../api/ArtistApi';
import { ArtistType } from '../dto/artists/ArtistType';
import { IArtistDto } from '../dto/artists/IArtistDto';

export class CreateArtistDialogStore {
	@observable dialogOpen = false;
	@observable name = '';
	@observable artistType = ArtistType.Person;
	@observable submitting = false;

	@action private reset = (): void => {
		this.dialogOpen = false;
		this.name = '';
		this.artistType = ArtistType.Person;
		this.submitting = false;
	};

	constructor() {
		makeObservable(this);

		this.reset();
	}

	@computed get isValid(): boolean {
		return (
			!!this.name.trim() &&
			Object.values(ArtistType).includes(this.artistType)
		);
	}

	@action show = (): void => {
		this.dialogOpen = true;
	};

	@action hide = (): void => {
		this.dialogOpen = false;
	};

	@action setName = (value: string): void => {
		this.name = value;
	};

	@action setArtistType = (value: ArtistType): void => {
		this.artistType = value;
	};

	@action submit = async (): Promise<IArtistDto> => {
		try {
			this.submitting = true;

			const artist = await createArtist({
				name: this.name,
				artistType: this.artistType,
			});

			this.reset();

			return artist;
		} catch (error) {
			runInAction(() => {
				this.submitting = false;
			});

			throw error;
		}
	};
}
