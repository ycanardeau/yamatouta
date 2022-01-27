import md5 from 'crypto-js/md5';

export const generateGravatarUrl = (email: string): string => {
	const hash = md5(email.trim().toLowerCase());

	return `https://www.gravatar.com/avatar/${hash}`;
};
