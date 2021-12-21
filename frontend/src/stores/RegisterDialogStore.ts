import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { register } from '../api/AuthApi';
import { IUserObject } from '../dto/users/IUserObject';

export class RegisterDialogStore {
	@observable submitting = false;
	@observable email = '';
	@observable username = '';
	@observable password = '';

	constructor() {
		makeObservable(this);
	}

	@computed get isValid(): boolean {
		return !!this.email && !!this.username && !!this.password;
	}

	@action setEmail = (value: string): void => {
		this.email = value;
	};

	@action setUsername = (value: string): void => {
		this.username = value;
	};

	@action setPassword = (value: string): void => {
		this.password = value;
	};

	@action submit = (): Promise<IUserObject> => {
		try {
			this.submitting = true;

			return register({
				email: this.email,
				username: this.username,
				password: this.password,
			});
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
