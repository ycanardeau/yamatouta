import { UserAuthenticateCommandHandler } from './UserAuthenticateCommandHandler';
import { UserCreateCommandHandler } from './UserCreateCommandHandler';
import { UserUpdateCommandHandler } from './UserUpdateCommandHandler';

export const userCommandHandlers = [
	UserAuthenticateCommandHandler,
	UserCreateCommandHandler,
	UserUpdateCommandHandler,
];
