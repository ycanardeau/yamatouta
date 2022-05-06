import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { createWork, updateWork } from '../../api/WorkApi';
import { IWorkObject } from '../../dto/works/IWorkObject';
import { WorkType } from '../../models/WorkType';
import { WebLinkListEditStore } from '../WebLinkListEditStore';

export class WorkEditStore {
	private readonly work?: IWorkObject;
	@observable submitting = false;
	@observable name = '';
	@observable workType = WorkType.Book;
	readonly webLinks: WebLinkListEditStore;

	constructor(work?: IWorkObject) {
		makeObservable(this);

		this.work = work;

		if (work) {
			this.name = work.name;
			this.workType = work.workType;
			this.webLinks = new WebLinkListEditStore(work.webLinks);
		} else {
			this.webLinks = new WebLinkListEditStore([]);
		}
	}

	@computed get isValid(): boolean {
		return !!this.name && !!this.workType;
	}

	@action setName = (value: string): void => {
		this.name = value;
	};

	@action setWorkType = (value: WorkType): void => {
		this.workType = value;
	};

	@action submit = async (): Promise<IWorkObject> => {
		try {
			this.submitting = true;

			const params = {
				name: this.name,
				workType: this.workType,
				webLinks: this.webLinks.items,
			};

			// Await.
			const work = await (this.work
				? updateWork({ ...params, workId: this.work.id })
				: createWork(params));

			return work;
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
