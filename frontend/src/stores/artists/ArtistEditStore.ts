import { artistApi } from '@/api/artistApi';
import { ArtistEditDto } from '@/dto/ArtistEditDto';
import { IArtistDto } from '@/dto/IArtistDto';
import { ArtistType } from '@/models/artists/ArtistType';
import { IArtistUpdateParams } from '@/models/artists/IArtistUpdateParams';
import { WebLinkListEditStore } from '@/stores/WebLinkListEditStore';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

export class ArtistEditStore {
	@observable submitting = false;
	@observable name = '';
	@observable artistType = ArtistType.Person;
	readonly webLinks: WebLinkListEditStore;

	constructor(private readonly artist?: ArtistEditDto) {
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

	toParams = (): IArtistUpdateParams => {
		return {
			id: this.artist?.id ?? 0,
			name: this.name,
			artistType: this.artistType,
			webLinks: this.webLinks.toParams(),
		};
	};

	@action submit = async (): Promise<IArtistDto> => {
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
