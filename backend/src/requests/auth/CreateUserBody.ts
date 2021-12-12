import {
	IsEmail,
	IsNotEmpty,
	Length,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateUserBody {
	@IsNotEmpty()
	@Length(2, 32)
	readonly username!: string;

	@IsEmail()
	@MaxLength(50)
	readonly email!: string;

	@IsNotEmpty()
	@MinLength(8)
	readonly password!: string;
}
