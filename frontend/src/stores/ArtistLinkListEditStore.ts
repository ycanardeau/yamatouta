import { artistApi } from '@/api/artistApi';
import { IArtistDto } from '@/dto/IArtistDto';
import { IArtistLinkDto } from '@/dto/ILinkDto';
import { IArtistLinkUpdateParams } from '@/models/IArtistLinkUpdateParams';
import { LinkType } from '@/models/LinkType';
import { BasicEntryLinkStore } from '@/stores/BasicEntryLinkStore';
import { BasicListEditStore } from '@/stores/BasicListEditStore';
import { action, makeObservable, observable } from 'mobx';

export class ArtistLinkEditStore {
	readonly relatedArtist = new BasicEntryLinkStore<IArtistDto>((id) =>
		artistApi.get({ id: id }),
	);
	@observable linkType = LinkType.Unspecified;
	//readonly beginDate: PartialDateEditStore;
	//readonly endDate: PartialDateEditStore;
	@observable ended = false;

	constructor(private readonly artistLink?: IArtistLinkDto) {
		makeObservable(this);

		if (artistLink) {
			this.relatedArtist.loadEntryById(artistLink.relatedArtist.id);
			this.linkType = artistLink.linkType;
			this.ended = artistLink.ended;
		}
	}

	@action setLinkType = (value: LinkType): void => {
		this.linkType = value;
	};

	toParams = (): IArtistLinkUpdateParams => {
		return {
			id: this.artistLink?.id ?? 0,
			relatedArtistId: this.relatedArtist.entry?.id ?? 0,
			linkType: this.linkType,
			beginDate: {} /* TODO */,
			endDate: {} /* TODO */,
			ended: this.ended,
		};
	};
}

export class ArtistLinkListEditStore extends BasicListEditStore<
	ArtistLinkEditStore,
	IArtistLinkDto
> {
	constructor(objects: IArtistLinkDto[]) {
		super(ArtistLinkEditStore, objects);
	}

	toParams = (): IArtistLinkUpdateParams[] => {
		return this.items.map((item) => item.toParams());
	};
}
