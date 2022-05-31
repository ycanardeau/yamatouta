import { NotFoundException } from '@nestjs/common';

import { UserObject } from '../../src/dto/UserObject';
import { FakeEntityManager } from '../FakeEntityManager';
import { FakePermissionContext } from '../FakePermissionContext';
import { createUser } from '../createEntry';

test('UserObject', async () => {
	const em = new FakeEntityManager();

	const user = await createUser(em as any, {
		username: 'user',
		email: 'user@example.com',
	});

	const deletedUser = await createUser(em as any, {
		username: 'deleted',
		email: 'deleted@example.com',
		deleted: true,
	});

	const hiddenUser = await createUser(em as any, {
		username: 'hidden',
		email: 'deleted@example.com',
		hidden: true,
	});

	const viewer = await createUser(em as any, {
		username: 'viewer',
		email: 'viewer@example.com',
	});

	const permissionContext = new FakePermissionContext(viewer);

	const userObject = UserObject.create(user, permissionContext);
	expect(userObject.id).toBe(user.id);
	expect(userObject.name).toBe(user.name);
	expect(userObject.avatarUrl).toBe(
		`https://www.gravatar.com/avatar/b58996c504c5638798eb6b511e6f49af`,
	);
	expect(userObject.avatarUrl).not.toBe(user.email);
	expect(userObject.avatarUrl).not.toBe(
		`https://www.gravatar.com/avatar/${user.email}`,
	);

	expect(() => UserObject.create(deletedUser, permissionContext)).toThrow(
		NotFoundException,
	);

	expect(() => UserObject.create(hiddenUser, permissionContext)).toThrow(
		NotFoundException,
	);
});
