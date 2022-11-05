import { IHashtagLinkDto } from '@/dto/IHashtagLinkDto';
import { IHashtagLinkUpdateParams } from '@/models/IHashtagLinkUpdateParams';
import { BasicListEditStore } from '@/stores/BasicListEditStore';
import { action, makeObservable, observable } from 'mobx';

export class HashtagLinkEditStore {
	@observable id = 0;
	@observable name = '';

	constructor(hashtagLink?: IHashtagLinkDto) {
		makeObservable(this);

		if (hashtagLink) {
			this.id = hashtagLink.id;
			this.name = hashtagLink.name;
		}
	}

	@action setName = (value: string): void => {
		this.name = value;
	};

	toParams = (): IHashtagLinkUpdateParams => {
		return {
			id: this.id,
			name: this.name,
		};
	};
}

export class HashtagLinkListEditStore extends BasicListEditStore<
	HashtagLinkEditStore,
	IHashtagLinkDto
> {
	constructor(objects: IHashtagLinkDto[]) {
		super(HashtagLinkEditStore, objects);
	}

	toParams = (): IHashtagLinkUpdateParams[] => {
		return this.items.map((item) => item.toParams());
	};
}
