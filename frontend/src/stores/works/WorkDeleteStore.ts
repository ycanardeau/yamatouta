import { workApi } from '@/api/workApi';
import { IWorkDto } from '@/dto/IWorkDto';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

export class WorkDeleteStore {
	@observable submitting = false;

	constructor(private readonly work: IWorkDto) {
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
