import _ from 'lodash';
import { makeObservable, observable } from 'mobx';

// Code from: https://github.com/VocaDB/vocadb/blob/11e105d6b0c838e6d3a089ecbe6c79cc4e8a0e7a/VocaDbWeb/Scripts/ViewModels/BasicListEditViewModel.ts.
export class BasicListEditStore<TItem, TObject> {
	@observable items: TItem[];

	public constructor(
		private readonly type: { new (object?: TObject): TItem },
		objects: TObject[],
	) {
		makeObservable(this);

		this.items = objects.map((object) => new type(object));
	}

	add = (): void => {
		this.items.push(new this.type());
	};

	remove = (item: TItem): void => {
		_.pull(this.items, item);
	};
}
