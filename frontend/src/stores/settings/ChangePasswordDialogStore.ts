import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { updateAuthenticatedUser } from '../../api/UserApi';
import { IAuthenticatedUserObject } from '../../dto/users/IAuthenticatedUserObject';

export class ChangePasswordDialogStore {
	@observable submitting = false;
	@observable currentPassword = '';
	@observable newPassword = '';
	@observable confirmNewPassword = '';

	constructor() {
		makeObservable(this);
	}

	@computed public get isValid(): boolean {
		return (
			!!this.currentPassword &&
			!!this.newPassword &&
			!!this.confirmNewPassword &&
			this.newPassword === this.confirmNewPassword
		);
	}

	@action setCurrentPassword = (value: string): void => {
		this.currentPassword = value;
	};

	@action setNewPassword = (value: string): void => {
		this.newPassword = value;
	};

	@action setConfirmNewPassword = (value: string): void => {
		this.confirmNewPassword = value;
	};

	@action submit = async (): Promise<IAuthenticatedUserObject> => {
		try {
			this.submitting = false;

			// Await.
			const user = await updateAuthenticatedUser({
				password: this.currentPassword,
				newPassword: this.newPassword,
			});

			return user;
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
