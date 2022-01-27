import { generateGravatarUrl } from '../../src/utils/generateGravatarUrl';

test('generateGravatarUrl', () => {
	const email = 'username@example.com';
	const emailHash = '5f0efb20de5ecfedbe0bf5e7c12353fe';
	const avatarUrl = generateGravatarUrl(email);

	expect(avatarUrl).toBe(`https://www.gravatar.com/avatar/${emailHash}`);
	expect(avatarUrl).not.toBe(`https://www.gravatar.com/avatar/${email}`);
});
