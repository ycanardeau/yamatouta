import { NormalizeEmailService } from '../../../src/services/users/NormalizeEmailService';

describe('NormalizeEmailService', () => {
	let normalizeEmailService: NormalizeEmailService;

	beforeEach(() => {
		normalizeEmailService = new NormalizeEmailService();
	});

	test('normalizeEmail', async () => {
		await expect(
			normalizeEmailService.normalizeEmail('username@example.com'),
		).resolves.toBe(`USERNAME@EXAMPLE.COM`);

		await expect(
			normalizeEmailService.normalizeEmail('john.smith@gmail.com'),
		).resolves.toBe(`JOHNSMITH@GMAIL.COM`);

		await expect(
			normalizeEmailService.normalizeEmail('jo.hn.sm.ith@gmail.com'),
		).resolves.toBe(`JOHNSMITH@GMAIL.COM`);

		await expect(
			normalizeEmailService.normalizeEmail('j.o.h.n.s.m.i.t.h@gmail.com'),
		).resolves.toBe(`JOHNSMITH@GMAIL.COM`);
	});
});
