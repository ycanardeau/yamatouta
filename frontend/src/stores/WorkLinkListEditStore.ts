import { makeObservable, observable } from 'mobx';

import { linkApi } from '../api/linkApi';
import { workApi } from '../api/workApi';
import { IWorkLinkObject } from '../dto/ILinkObject';
import { ILinkTypeObject } from '../dto/ILinkTypeObject';
import { IWorkObject } from '../dto/IWorkObject';
import { IWorkLinkUpdateParams } from '../models/IWorkLinkUpdateParams';
import { BasicEntryLinkStore } from './BasicEntryLinkStore';
import { BasicListEditStore } from './BasicListEditStore';

export class WorkLinkEditStore {
	readonly linkType = new BasicEntryLinkStore<ILinkTypeObject>((id) =>
		linkApi.getType({ id: id }),
	);
	readonly relatedWork = new BasicEntryLinkStore<IWorkObject>((id) =>
		workApi.get({ id: id }),
	);
	//readonly beginDate: PartialDateEditStore;
	//readonly endDate: PartialDateEditStore;
	@observable ended = false;

	constructor(private readonly workLink?: IWorkLinkObject) {
		makeObservable(this);

		if (workLink) {
			this.linkType.loadEntryById(workLink.linkType.id);
			this.relatedWork.loadEntryById(workLink.relatedWork.id);
			this.ended = workLink.ended;
		}
	}

	toParams = (): IWorkLinkUpdateParams => {
		return {
			id: this.workLink?.id ?? 0,
			linkTypeId: this.linkType.entry?.id ?? 0,
			relatedWorkId: this.relatedWork.entry?.id ?? 0,
			beginDate: {} /* TODO */,
			endDate: {} /* TODO */,
			ended: this.ended,
		};
	};
}

export class WorkLinkListEditStore extends BasicListEditStore<
	WorkLinkEditStore,
	IWorkLinkObject
> {
	constructor(objects: IWorkLinkObject[]) {
		super(WorkLinkEditStore, objects);
	}

	toParams = (): IWorkLinkUpdateParams[] => {
		return this.items.map((item) => item.toParams());
	};
}
