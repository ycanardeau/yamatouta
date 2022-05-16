import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { deleteWork } from '../../api/WorkApi';
import { IWorkObject } from '../../dto/IWorkObject';

export class WorkDeleteStore {
	private readonly work: IWorkObject;
	@observable submitting = false;

	constructor({ work }: { work: IWorkObject }) {
		makeObservable(this);

		this.work = work;
	}

	@computed get isValid(): boolean {
		return true;
	}

	@action submit = async (): Promise<void> => {
		try {
			this.submitting = true;

			await deleteWork({ workId: this.work.id });
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
