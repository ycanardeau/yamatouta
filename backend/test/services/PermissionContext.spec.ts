import { User } from '@/entities/User';
import { Permission } from '@/models/Permission';
import { ArtistType } from '@/models/artists/ArtistType';
import { QuoteType } from '@/models/quotes/QuoteType';
import { WordCategory } from '@/models/translations/WordCategory';
import { userGroupPermissions } from '@/models/userGroupPermissions';
import { UserGroup } from '@/models/users/UserGroup';
import { WorkType } from '@/models/works/WorkType';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import {
	INestApplication,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import _ from 'lodash';
import { FakePermissionContext } from 'test/FakePermissionContext';
import { createApplication } from 'test/createApplication';
import {
	createArtist,
	createQuote,
	createTranslation,
	createUser,
	createWork,
} from 'test/createEntry';

describe('PermissionContext', () => {
	let app: INestApplication;
	let em: EntityManager;
	let users: User[];

	beforeAll(async () => {
		app = await createApplication();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(async () => {
		em = app.get(EntityManager);

		users = await Promise.all([
			createUser(em, {
				username: 'limited',
				email: 'limited@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.LimitedUser,
			}),
			createUser(em, {
				username: 'user',
				email: 'user@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.User,
			}),
			createUser(em, {
				username: 'advanced',
				email: 'advanced@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.AdvancedUser,
			}),
			createUser(em, {
				username: 'mod',
				email: 'mod@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.Mod,
			}),
			createUser(em, {
				username: 'senior',
				email: 'senior@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.SeniorMod,
			}),
			createUser(em, {
				username: 'admin',
				email: 'admin@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.Admin,
			}),
		]);
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	test('hasPermission', async () => {
		for (const user of users) {
			const allowedPermissions = userGroupPermissions[user.userGroup];
			const disallowedPermissions = _.difference(
				Object.values(Permission),
				allowedPermissions,
			);

			expect(allowedPermissions.length).toBe(
				userGroupPermissions[user.userGroup].length,
			);
			expect(disallowedPermissions.length).toBe(
				Object.values(Permission).length - allowedPermissions.length,
			);

			expect(user.effectivePermissions).toEqual(allowedPermissions);

			const permissionContext = new FakePermissionContext(user);

			for (const permission of allowedPermissions) {
				expect(permissionContext.hasPermission(permission)).toBe(true);

				permissionContext.verifyPermission(permission);
			}

			for (const permission of disallowedPermissions) {
				expect(permissionContext.hasPermission(permission)).toBe(false);

				expect(() =>
					permissionContext.verifyPermission(permission),
				).toThrow(UnauthorizedException);
			}
		}
	});

	test('verifyDeletedAndHidden', async () => {
		const artist = await createArtist(em, {
			name: '',
			artistType: ArtistType.Person,
			actor: users[5],
		});
		const quote = await createQuote(em, {
			quoteType: QuoteType.Tanka,
			text: '',
			locale: 'ja',
			artist: artist,
			actor: users[5],
		});
		const translation = await createTranslation(em, {
			headword: '',
			locale: 'ja',
			reading: '',
			yamatokotoba: '',
			category: WordCategory.Noun,
			actor: users[5],
		});
		const user = await createUser(em, {
			username: '',
			email: '',
			password: '',
			userGroup: UserGroup.User,
		});
		const work = await createWork(em, {
			name: '',
			workType: WorkType.Book,
			actor: users[5],
		});

		const entries = [artist, quote, translation, user, work];

		for (const entry of entries) {
			entry.deleted = false;
			entry.hidden = false;

			for (const user of users) {
				const permissionContext = new FakePermissionContext(user);

				expect(() =>
					permissionContext.verifyDeletedAndHidden(entry),
				).not.toThrow();
			}
		}

		for (const entry of entries) {
			entry.deleted = true;
			entry.hidden = false;

			for (const user of users) {
				const permissionContext = new FakePermissionContext(user);

				if (permissionContext.canViewHiddenEntries) {
					expect(() =>
						permissionContext.verifyDeletedAndHidden(entry),
					).not.toThrow();
				} else {
					expect(() =>
						permissionContext.verifyDeletedAndHidden(entry),
					).toThrow(NotFoundException);
				}
			}
		}

		for (const entry of entries) {
			entry.deleted = false;
			entry.hidden = true;

			for (const user of users) {
				const permissionContext = new FakePermissionContext(user);

				if (permissionContext.canViewHiddenEntries) {
					expect(() =>
						permissionContext.verifyDeletedAndHidden(entry),
					).not.toThrow();
				} else {
					expect(() =>
						permissionContext.verifyDeletedAndHidden(entry),
					).toThrow(NotFoundException);
				}
			}
		}

		for (const entry of entries) {
			entry.deleted = true;
			entry.hidden = true;

			for (const user of users) {
				const permissionContext = new FakePermissionContext(user);

				if (
					permissionContext.canViewDeletedEntries &&
					permissionContext.canViewHiddenEntries
				) {
					expect(() =>
						permissionContext.verifyDeletedAndHidden(entry),
					).not.toThrow();
				} else {
					expect(() =>
						permissionContext.verifyDeletedAndHidden(entry),
					).toThrow(NotFoundException);
				}
			}
		}
	});
});
