import { AuthenticatedUserObject } from '../../../src/dto/users/AuthenticatedUserObject';
import { User } from '../../../src/entities/User';
import { PasswordHashAlgorithm } from '../../../src/models/PasswordHashAlgorithm';

test('AuthenticatedUserObject', () => {
	const user = new User({
		name: 'user',
		email: 'user@example.com',
		normalizedEmail: '',
		passwordHashAlgorithm: PasswordHashAlgorithm.Bcrypt,
		salt: '',
		passwordHash: '',
	});
	user.id = 1;

	const userObject = new AuthenticatedUserObject(user);
	expect(userObject.id).toBe(user.id);
	expect(userObject.avatarUrl).toBe(
		`https://www.gravatar.com/avatar/b58996c504c5638798eb6b511e6f49af`,
	);
	expect(userObject.avatarUrl).not.toBe(user.email);
	expect(userObject.avatarUrl).not.toBe(
		`https://www.gravatar.com/avatar/${user.email}`,
	);
});
