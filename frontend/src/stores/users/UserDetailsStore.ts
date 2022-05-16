import { action, makeObservable, observable } from 'mobx';

import { IUserObject } from '../../dto/IUserObject';

export class UserDetailsStore {
	@observable user: IUserObject;

	constructor(user: IUserObject) {
		makeObservable(this);

		this.user = user;
	}

	@action setUser = (value: IUserObject): void => {
		this.user = value;
	};
}
