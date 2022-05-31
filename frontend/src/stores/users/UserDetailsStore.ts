import { UserDetailsObject } from '../../dto/UserDetailsObject';

export class UserDetailsStore {
	constructor(readonly user: UserDetailsObject) {}
}
