import { AuthenticatedUserObject } from '../src/dto/users/AuthenticatedUserObject';
import { User } from '../src/entities/User';
import { PermissionContext } from '../src/services/PermissionContext';

export class FakePermissionContext extends PermissionContext {
	constructor(user: User) {
		super({
			user: new AuthenticatedUserObject(user),
			socket: { remoteAddress: '::1' },
		} as any);
	}
}
