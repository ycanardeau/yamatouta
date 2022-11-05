import { AuthenticatedUserDto } from '@/dto/AuthenticatedUserDto';
import { User } from '@/entities/User';
import { PermissionContext } from '@/services/PermissionContext';

export class FakePermissionContext extends PermissionContext {
	constructor(user?: User) {
		super({
			user: user ? AuthenticatedUserDto.create(user) : undefined,
			socket: { remoteAddress: '::1' },
		} as any);
	}
}
