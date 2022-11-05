import { AuthenticatedUserObject } from '@/dto/AuthenticatedUserObject';
import { Request } from 'express';

export const getUser = (
	request: Request,
): AuthenticatedUserObject | undefined => {
	if (!request.user) return undefined;

	if (request.user instanceof AuthenticatedUserObject) return request.user;

	throw new Error('user must be of type AuthenticatedUserObject.');
};
