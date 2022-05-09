import { makeObservable, observable } from 'mobx';

import { linkApi } from '../api/linkApi';
import { workApi } from '../api/workApi';
import { ILinkTypeObject } from '../dto/ILinkTypeObject';
import { IWorkLinkObject } from '../dto/IWorkLinkObject';
import { IWorkObject } from '../dto/IWorkObject';
import { BasicEntryLinkStore } from './BasicEntryLinkStore';
import { BasicListEditStore } from './BasicListEditStore';

export class WorkLinkEditStore {
	readonly linkType = new BasicEntryLinkStore<ILinkTypeObject>((entryId) =>
		linkApi.getType({ id: entryId }),
	);
	readonly work = new BasicEntryLinkStore<IWorkObject>((entryId) =>
		workApi.get({ id: entryId }),
	);
	@observable ended = false;

	constructor(workLink?: IWorkLinkObject) {
		makeObservable(this);

		if (workLink) {
			this.work.loadEntryById(workLink.work.id);
			this.ended = workLink.link.ended;
		}
	}
}

export class WorkLinkListEditStore extends BasicListEditStore<
	WorkLinkEditStore,
	IWorkLinkObject
> {
	constructor(objects: IWorkLinkObject[]) {
		super(WorkLinkEditStore, objects);
	}
}
