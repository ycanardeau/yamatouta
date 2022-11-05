import { IUserDto } from '@/dto/IUserDto';
import { EntryType } from '@/models/EntryType';

export class UserDetailsDto {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType.User,
		readonly name: string,
		readonly avatarUrl: string,
	) {}

	static create(user: Required<IUserDto>): UserDetailsDto {
		return new UserDetailsDto(
			user.id,
			user.entryType,
			user.name,
			user.avatarUrl,
		);
	}
}
