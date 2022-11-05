import { userApi } from '@/api/userApi';
import { IUserObject } from '@/dto/IUserObject';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

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

	@action submit = async (): Promise<IUserObject> => {
		try {
			this.submitting = true;

			// Await.
			const user = await userApi.create({
				email: this.email,
				username: this.username,
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
