import { EntryType } from '../models/EntryType';
import { IUserObject } from './IUserObject';

export class UserDetailsObject {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType.User,
		readonly name: string,
		readonly avatarUrl: string,
	) {}

	static create(user: Required<IUserObject>): UserDetailsObject {
		return new UserDetailsObject(
			user.id,
			user.entryType,
			user.name,
			user.avatarUrl,
		);
	}
}
