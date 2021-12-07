import { User } from '../../entities/User';

export class UserObject {
	readonly id: number;
	readonly name: string;

	constructor(user: User) {
		if (user.deleted || user.hidden)
			throw new Error(`User ${user.id} has already been deleted.`);

		this.id = user.id;
		this.name = user.name;
	}
}
