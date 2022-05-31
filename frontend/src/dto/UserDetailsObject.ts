import { IUserObject } from './IUserObject';

export class UserDetailsObject {
	private constructor(
		readonly id: number,
		readonly name: string,
		readonly avatarUrl: string,
	) {}

	static create(user: Required<IUserObject>): UserDetailsObject {
		return new UserDetailsObject(user.id, user.name, user.avatarUrl);
	}
}
