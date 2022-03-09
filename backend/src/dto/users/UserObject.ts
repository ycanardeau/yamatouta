import { User } from '../../entities/User';
import { PermissionContext } from '../../services/PermissionContext';
import { generateGravatarUrl } from '../../utils/generateGravatarUrl';

export class UserObject {
	readonly id: number;
	readonly deleted: boolean;
	readonly hidden: boolean;
	readonly name: string;
	readonly avatarUrl: string;

	constructor(user: User, permissionContext: PermissionContext) {
		permissionContext.verifyDeletedAndHidden(user);

		this.id = user.id;
		this.deleted = user.deleted;
		this.hidden = user.hidden;
		this.name = user.name;
		this.avatarUrl = generateGravatarUrl(user.email);
	}
}
