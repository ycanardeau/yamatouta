import { AuthenticatedUserObject } from '../src/dto/AuthenticatedUserObject';
import { User } from '../src/entities/User';
import { PermissionContext } from '../src/services/PermissionContext';

export class FakePermissionContext extends PermissionContext {
	constructor(user?: User) {
		super({
			user: user ? new AuthenticatedUserObject(user) : undefined,
			socket: { remoteAddress: '::1' },
		} as any);
	}
}
