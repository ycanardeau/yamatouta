import { AuthenticatedUserDto } from '@/dto/AuthenticatedUserDto';
import { Request } from 'express';

export const getUser = (request: Request): AuthenticatedUserDto | undefined => {
	if (!request.user) return undefined;

	if (request.user instanceof AuthenticatedUserDto) return request.user;

	throw new Error('user must be of type AuthenticatedUserDto.');
};
