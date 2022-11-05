import { pull } from 'lodash-es';
import { action, makeObservable, observable } from 'mobx';

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

	@action add = (): TItem => {
		const item = new this.type();
		this.items.push(item);
		return item;
	};

	@action remove = (item: TItem): void => {
		pull(this.items, item);
	};
}
