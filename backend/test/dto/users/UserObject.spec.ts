import { NotFoundException } from '@nestjs/common';

import { UserObject } from '../../../src/dto/users/UserObject';
import { FakeEntityManager } from '../../FakeEntityManager';
import { FakePermissionContext } from '../../FakePermissionContext';
import { createUser } from '../../createEntry';

test('UserObject', async () => {
	const em = new FakeEntityManager();

	const user = await createUser(em as any, {
		id: 1,
		username: 'user',
		email: 'user@example.com',
	});

	const deletedUser = await createUser(em as any, {
		id: 2,
		username: 'deleted',
		email: 'deleted@example.com',
		deleted: true,
	});

	const hiddenUser = await createUser(em as any, {
		id: 3,
		username: 'hidden',
		email: 'deleted@example.com',
		hidden: true,
	});

	const viewer = await createUser(em as any, {
		id: 4,
		username: 'viewer',
		email: 'viewer@example.com',
	});

	const permissionContext = new FakePermissionContext(viewer);

	const userObject = new UserObject(user, permissionContext);
	expect(userObject.id).toBe(user.id);
	expect(userObject.name).toBe(user.name);
	expect(userObject.avatarUrl).toBe(
		`https://www.gravatar.com/avatar/b58996c504c5638798eb6b511e6f49af`,
	);
	expect(userObject.avatarUrl).not.toBe(user.email);
	expect(userObject.avatarUrl).not.toBe(
		`https://www.gravatar.com/avatar/${user.email}`,
	);

	expect(() => new UserObject(deletedUser, permissionContext)).toThrow(
		NotFoundException,
	);

	expect(() => new UserObject(hiddenUser, permissionContext)).toThrow(
		NotFoundException,
	);
});
