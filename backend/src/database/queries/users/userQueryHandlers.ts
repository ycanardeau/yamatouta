import { UserGetCurrentQueryHandler } from '@/database/queries/users/UserGetCurrentQueryHandler';
import { UserGetQueryHandler } from '@/database/queries/users/UserGetQueryHandler';
import { UserListQueryHandler } from '@/database/queries/users/UserListQueryHandler';

export const userQueryHandlers = [
	UserGetCurrentQueryHandler,
	UserGetQueryHandler,
	UserListQueryHandler,
];
