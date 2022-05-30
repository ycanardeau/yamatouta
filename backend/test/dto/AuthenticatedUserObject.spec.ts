import { AuthenticatedUserObject } from '../../src/dto/AuthenticatedUserObject';
import { FakeEntityManager } from '../FakeEntityManager';
import { createUser } from '../createEntry';

test('AuthenticatedUserObject', async () => {
	const em = new FakeEntityManager();

	const user = await createUser(em as any, {
		username: 'user',
		email: 'user@example.com',
	});

	const userObject = AuthenticatedUserObject.create(user);
	expect(userObject.id).toBe(user.id);
	expect(userObject.avatarUrl).toBe(
		`https://www.gravatar.com/avatar/b58996c504c5638798eb6b511e6f49af`,
	);
	expect(userObject.avatarUrl).not.toBe(user.email);
	expect(userObject.avatarUrl).not.toBe(
		`https://www.gravatar.com/avatar/${user.email}`,
	);
});
