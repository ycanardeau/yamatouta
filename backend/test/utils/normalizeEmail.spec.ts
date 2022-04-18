import { normalizeEmail } from '../../src/utils/normalizeEmail';

test('normalizeEmail', async () => {
	await expect(normalizeEmail('username@example.com')).resolves.toBe(
		`USERNAME@EXAMPLE.COM`,
	);

	await expect(normalizeEmail('john.smith@gmail.com')).resolves.toBe(
		`JOHNSMITH@GMAIL.COM`,
	);

	await expect(normalizeEmail('jo.hn.sm.ith@gmail.com')).resolves.toBe(
		`JOHNSMITH@GMAIL.COM`,
	);

	await expect(normalizeEmail('j.o.h.n.s.m.i.t.h@gmail.com')).resolves.toBe(
		`JOHNSMITH@GMAIL.COM`,
	);
});
