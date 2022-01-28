import { NotFoundException } from '@nestjs/common';

import { UserObject } from '../../../src/dto/users/UserObject';
import { User } from '../../../src/entities/User';
import { PasswordHashAlgorithm } from '../../../src/models/PasswordHashAlgorithm';
import { FakePermissionContext } from '../../FakePermissionContext';

test('UserObject', () => {
	const user = new User({
		name: 'user',
		email: 'user@example.com',
		normalizedEmail: '',
		passwordHashAlgorithm: PasswordHashAlgorithm.Bcrypt,
		salt: '',
		passwordHash: '',
	});
	user.id = 1;

	const deletedUser = new User({
		name: 'deleted',
		email: 'deleted@example.com',
		normalizedEmail: '',
		passwordHashAlgorithm: PasswordHashAlgorithm.Bcrypt,
		salt: '',
		passwordHash: '',
	});
	deletedUser.id = 2;
	deletedUser.deleted = true;

	const hiddenUser = new User({
		name: 'hidden',
		email: 'deleted@example.com',
		normalizedEmail: '',
		passwordHashAlgorithm: PasswordHashAlgorithm.Bcrypt,
		salt: '',
		passwordHash: '',
	});
	hiddenUser.id = 3;
	hiddenUser.hidden = true;

	const viewer = new User({
		name: 'viewer',
		email: 'viewer@example.com',
		normalizedEmail: '',
		passwordHashAlgorithm: PasswordHashAlgorithm.Bcrypt,
		salt: '',
		passwordHash: '',
	});
	viewer.id = 4;

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
