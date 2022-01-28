import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { updateAuthenticatedUser } from '../../api/UserApi';
import { IAuthenticatedUserObject } from '../../dto/users/IAuthenticatedUserObject';

export class ChangeUsernameDialogStore {
	@observable submitting = false;
	@observable currentPassword = '';
	@observable username = '';

	constructor(user: IAuthenticatedUserObject) {
		makeObservable(this);

		this.username = user.name;
	}

	@computed public get isValid(): boolean {
		return !!this.currentPassword && !!this.username;
	}

	@action public setCurrentPassword = (value: string): void => {
		this.currentPassword = value;
	};

	@action public setUsername = (value: string): void => {
		this.username = value;
	};

	@action submit = async (): Promise<IAuthenticatedUserObject> => {
		try {
			this.submitting = false;

			// Await.
			const user = await updateAuthenticatedUser({
				password: this.currentPassword,
				username: this.username,
			});

			return user;
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
