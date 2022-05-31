import { UserGetCurrentQueryHandler } from './UserGetCurrentQueryHandler';
import { UserGetQueryHandler } from './UserGetQueryHandler';
import { UserListQueryHandler } from './UserListQueryHandler';

export const userQueryHandlers = [
	UserGetCurrentQueryHandler,
	UserGetQueryHandler,
	UserListQueryHandler,
];
