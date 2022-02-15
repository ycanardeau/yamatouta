import { AuthenticatedUserObject } from '../../../src/dto/users/AuthenticatedUserObject';
import { createUser } from '../../createEntry';

test('AuthenticatedUserObject', async () => {
	const user = await createUser({
		id: 1,
		username: 'user',
		email: 'user@example.com',
	});

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
