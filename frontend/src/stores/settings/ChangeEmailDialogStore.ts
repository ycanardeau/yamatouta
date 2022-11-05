import { userApi } from '@/api/userApi';
import { IAuthenticatedUserDto } from '@/dto/IAuthenticatedUserDto';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

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

	@action submit = async (): Promise<IAuthenticatedUserDto> => {
		try {
			this.submitting = false;

			// Await.
			const user = await userApi.update({
				password: this.currentPassword,
				email: this.email,
			});

			return user;
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
