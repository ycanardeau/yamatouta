import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { workApi } from '../../api/workApi';
import { IWorkObject } from '../../dto/IWorkObject';

export class WorkDeleteStore {
	@observable submitting = false;

	constructor(private readonly work: IWorkObject) {
		makeObservable(this);
	}

	@computed get isValid(): boolean {
		return true;
	}

	@action submit = async (): Promise<void> => {
		try {
			this.submitting = true;

			await workApi.delete({ id: this.work.id });
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
