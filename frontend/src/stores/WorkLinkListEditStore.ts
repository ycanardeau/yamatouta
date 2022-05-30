import { action, makeObservable, observable } from 'mobx';

import { workApi } from '../api/workApi';
import { IWorkLinkObject } from '../dto/ILinkObject';
import { IWorkObject } from '../dto/IWorkObject';
import { IWorkLinkUpdateParams } from '../models/IWorkLinkUpdateParams';
import { LinkType } from '../models/LinkType';
import { BasicEntryLinkStore } from './BasicEntryLinkStore';
import { BasicListEditStore } from './BasicListEditStore';

export class WorkLinkEditStore {
	readonly relatedWork = new BasicEntryLinkStore<IWorkObject>((id) =>
		workApi.get({ id: id }),
	);
	@observable linkType = LinkType.Work_Artist_Author;
	//readonly beginDate: PartialDateEditStore;
	//readonly endDate: PartialDateEditStore;
	@observable ended = false;

	constructor(private readonly workLink?: IWorkLinkObject) {
		makeObservable(this);

		if (workLink) {
			this.relatedWork.loadEntryById(workLink.relatedWork.id);
			this.linkType = workLink.linkType;
			this.ended = workLink.ended;
		}
	}

	@action setLinkType = (value: LinkType): void => {
		this.linkType = value;
	};

	toParams = (): IWorkLinkUpdateParams => {
		return {
			id: this.workLink?.id ?? 0,
			relatedWorkId: this.relatedWork.entry?.id ?? 0,
			linkType: this.linkType,
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
