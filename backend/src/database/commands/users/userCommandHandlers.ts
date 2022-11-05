import { UserAuthenticateCommandHandler } from '@/database/commands/users/UserAuthenticateCommandHandler';
import { UserCreateCommandHandler } from '@/database/commands/users/UserCreateCommandHandler';
import { UserUpdateCommandHandler } from '@/database/commands/users/UserUpdateCommandHandler';

export const userCommandHandlers = [
	UserAuthenticateCommandHandler,
	UserCreateCommandHandler,
	UserUpdateCommandHandler,
];
