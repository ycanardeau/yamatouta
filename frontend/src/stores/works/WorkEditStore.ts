import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { workApi } from '../../api/workApi';
import { IWorkObject } from '../../dto/IWorkObject';
import { WorkEditObject } from '../../dto/WorkEditObject';
import { IWorkUpdateParams } from '../../models/works/IWorkUpdateParams';
import { WorkType } from '../../models/works/WorkType';
import { ArtistLinkListEditStore } from '../ArtistLinkListEditStore';
import { HashtagListEditStore } from '../HashtagListEditStore';
import { WebLinkListEditStore } from '../WebLinkListEditStore';

export class WorkEditStore {
	@observable submitting = false;
	@observable name = '';
	@observable workType = WorkType.Book;
	readonly hashtags: HashtagListEditStore;
	readonly webLinks: WebLinkListEditStore;
	readonly artistLinks: ArtistLinkListEditStore;

	constructor(private readonly work?: WorkEditObject) {
		makeObservable(this);

		if (work) {
			this.name = work.name;
			this.workType = work.workType;
			this.hashtags = new HashtagListEditStore([] /* TODO */);
			this.webLinks = new WebLinkListEditStore(work.webLinks);
			this.artistLinks = new ArtistLinkListEditStore(work.artistLinks);
		} else {
			this.hashtags = new HashtagListEditStore([]);
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

	toParams = (): IWorkUpdateParams => {
		return {
			id: this.work?.id ?? 0,
			name: this.name,
			workType: this.workType,
			hashtags: this.hashtags.toParams(),
			webLinks: this.webLinks.toParams(),
			artistLinks: this.artistLinks.toParams(),
		};
	};

	@action submit = async (): Promise<IWorkObject> => {
		try {
			this.submitting = true;

			const createOrUpdate = this.work ? workApi.update : workApi.create;

			// Await.
			const work = await createOrUpdate(this.toParams());

			return work;
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
