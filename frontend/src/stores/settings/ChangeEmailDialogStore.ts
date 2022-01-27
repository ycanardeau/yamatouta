import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { updateAuthenticatedUser } from '../../api/UserApi';

export class ChangeEmailDialogStore {
	@observable submitting = false;
	@observable currentPassword = '';
	@observable email = '';

	constructor() {
		makeObservable(this);
	}

	@computed public get isValid(): boolean {
		return !!this.currentPassword && !!this.email;
	}

	@action public setCurrentPassword = (value: string): void => {
		this.currentPassword = value;
	};

	@action public setEmail = (value: string): void => {
		this.email = value;
	};

	@action submit = async (): Promise<void> => {
		this.submitting = false;

		try {
			await updateAuthenticatedUser({
				password: this.currentPassword,
				email: this.email,
			});
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
