import { IHashtagLinkObject } from '@/dto/IHashtagLinkObject';
import { IHashtagLinkUpdateParams } from '@/models/IHashtagLinkUpdateParams';
import { BasicListEditStore } from '@/stores/BasicListEditStore';
import { action, makeObservable, observable } from 'mobx';

export class HashtagLinkEditStore {
	@observable id = 0;
	@observable name = '';

	constructor(hashtagLink?: IHashtagLinkObject) {
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
	IHashtagLinkObject
> {
	constructor(objects: IHashtagLinkObject[]) {
		super(HashtagLinkEditStore, objects);
	}

	toParams = (): IHashtagLinkUpdateParams[] => {
		return this.items.map((item) => item.toParams());
	};
}
