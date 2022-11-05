import { userApi } from '@/api/userApi';
import { IAuthenticatedUserDto } from '@/dto/IAuthenticatedUserDto';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

export class ChangeUsernameDialogStore {
	@observable submitting = false;
	@observable currentPassword = '';
	@observable username = '';

	constructor(user: IAuthenticatedUserDto) {
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

	@action submit = async (): Promise<IAuthenticatedUserDto> => {
		try {
			this.submitting = false;

			// Await.
			const user = await userApi.update({
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
