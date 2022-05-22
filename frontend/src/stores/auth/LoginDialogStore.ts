import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { authApi } from '../../api/authApi';
import { IAuthenticatedUserObject } from '../../dto/IAuthenticatedUserObject';

export class LoginDialogStore {
	@observable submitting = false;
	@observable email = '';
	@observable password = '';

	constructor() {
		makeObservable(this);
	}

	@computed get isValid(): boolean {
		return !!this.email && !!this.password;
	}

	@action setEmail = (value: string): void => {
		this.email = value;
	};

	@action setPassword = (value: string): void => {
		this.password = value;
	};

	@action submit = async (): Promise<IAuthenticatedUserObject> => {
		try {
			this.submitting = true;

			// Await.
			const user = await authApi.login({
				email: this.email,
				password: this.password,
			});

			return user;
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
