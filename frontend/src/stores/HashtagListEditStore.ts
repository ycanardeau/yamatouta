import { action, makeObservable, observable } from 'mobx';

import { IHashtagObject } from '../dto/IHashtagObject';
import { IHashtagUpdateParams } from '../models/IHashtagUpdateParams';
import { BasicListEditStore } from './BasicListEditStore';

export class HashtagEditStore {
	@observable id = 0;
	@observable name = '';

	constructor(hashtag?: IHashtagObject) {
		makeObservable(this);

		if (hashtag) {
			this.id = hashtag.id;
			this.name = hashtag.name;
		}
	}

	@action setName = (value: string): void => {
		this.name = value;
	};

	toParams = (): IHashtagUpdateParams => {
		return {
			id: this.id,
			name: this.name,
		};
	};
}

export class HashtagListEditStore extends BasicListEditStore<
	HashtagEditStore,
	IHashtagObject
> {
	constructor(objects: IHashtagObject[]) {
		super(HashtagEditStore, objects);
	}

	toParams = (): IHashtagUpdateParams[] => {
		return this.items.map((item) => item.toParams());
	};
}
