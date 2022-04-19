import { Request } from 'express';

import { AuthenticatedUserObject } from '../dto/users/AuthenticatedUserObject';

export const getUser = (
	request: Request,
): AuthenticatedUserObject | undefined => {
	if (!request.user) return undefined;

	if (request.user instanceof AuthenticatedUserObject) return request.user;

	throw new Error('user must be of type AuthenticatedUserObject.');
};
