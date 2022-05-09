import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { workApi } from '../../api/workApi';
import { IWorkObject } from '../../dto/IWorkObject';
import { WorkType } from '../../models/works/WorkType';
import { ArtistLinkListEditStore } from '../ArtistLinkListEditStore';
import { WebLinkListEditStore } from '../WebLinkListEditStore';

export class WorkEditStore {
	@observable submitting = false;
	@observable name = '';
	@observable workType = WorkType.Book;
	readonly webLinks: WebLinkListEditStore;
	readonly artistLinks: ArtistLinkListEditStore;

	constructor(private readonly work?: IWorkObject) {
		makeObservable(this);

		if (work) {
			this.name = work.name;
			this.workType = work.workType;
			this.webLinks = new WebLinkListEditStore(work.webLinks);
			this.artistLinks = new ArtistLinkListEditStore(work.artistLinks);
		} else {
			this.webLinks = new WebLinkListEditStore([]);
			this.artistLinks = new ArtistLinkListEditStore([]);
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

			const createOrUpdate = this.work ? workApi.update : workApi.create;

			// Await.
			const work = await createOrUpdate({
				id: this.work?.id ?? 0,
				name: this.name,
				workType: this.workType,
				webLinks: this.webLinks.items,
			});

			return work;
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
