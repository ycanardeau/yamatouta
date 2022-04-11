import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { createWork } from '../../api/WorkApi';
import { IWorkObject } from '../../dto/works/IWorkObject';
import { WorkType } from '../../models/WorkType';

export class CreateWorkDialogStore {
	@observable submitting = false;
	@observable name = '';
	@observable workType = WorkType.Book;

	constructor() {
		makeObservable(this);
	}

	@computed get isValid(): boolean {
		return (
			!!this.name.trim() &&
			Object.values(WorkType).includes(this.workType)
		);
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

			// Await.
			const work = await createWork({
				name: this.name,
				workType: this.workType,
			});

			return work;
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
