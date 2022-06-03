import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';

import { Translation } from '../../src/entities/Translation';
import { User } from '../../src/entities/User';
import { WebAddress } from '../../src/entities/WebAddress';
import { WebAddressHost } from '../../src/entities/WebAddressHost';
import { WebLink } from '../../src/entities/WebLink';
import { UserGroup } from '../../src/models/UserGroup';
import { WebLinkCategory } from '../../src/models/WebLinkCategory';
import { WebLinkUpdateParams } from '../../src/models/WebLinkUpdateParams';
import { WordCategory } from '../../src/models/translations/WordCategory';
import { WebLinkService } from '../../src/services/WebLinkService';
import { FakePermissionContext } from '../FakePermissionContext';
import { createApplication } from '../createApplication';
import { createTranslation, createUser } from '../createEntry';

describe('WebLinkService', () => {
	describe('sync', () => {
		let app: INestApplication;
		let webLinkService: WebLinkService;
		let em: EntityManager;
		let existingUser: User;
		let translation: Translation;
		let permissionContext: FakePermissionContext;

		const defaultWebLinks: WebLinkUpdateParams[] = [
			{
				id: 0,
				url: 'https://yamatouta.net/translations/1',
				title: 'やまとうた',
				category: WebLinkCategory.Reference,
			},
			{
				id: 0,
				url: 'https://inishienomanabi.net/translations/1/view',
				title: 'いにしえのまなび',
				category: WebLinkCategory.Reference,
			},
			{
				id: 0,
				url: 'https://ja.wikipedia.org/wiki/%E5%A4%A7%E5%92%8C%E8%A8%80%E8%91%89',
				title: 'Wikipedia (JA)',
				category: WebLinkCategory.Reference,
			},
			{
				id: 0,
				url: 'https://ja.wikipedia.org/wiki/%E5%92%8C%E6%AD%8C',
				title: 'Wikipedia (JA)',
				category: WebLinkCategory.Reference,
			},
		];

		beforeAll(async () => {
			app = await createApplication();
		});

		afterAll(async () => {
			await app.close();
		});

		beforeEach(async () => {
			webLinkService = app.get(WebLinkService);
			em = app.get(EntityManager);

			existingUser = await createUser(em, {
				username: 'existing',
				email: 'existing@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.Admin,
			});

			translation = await createTranslation(em, {
				headword: '大和言葉',
				locale: 'ja',
				reading: 'やまとことば',
				yamatokotoba: 'やまとことば',
				category: WordCategory.Noun,
				user: existingUser,
			});

			permissionContext = new FakePermissionContext(existingUser);
		});

		afterEach(async () => {
			const orm = app.get(MikroORM);
			const generator = orm.getSchemaGenerator();

			await generator.clearDatabase();
		});

		beforeEach(async () => {
			await webLinkService.sync(
				em,
				translation,
				defaultWebLinks,
				permissionContext,
				existingUser,
			);
		});

		const assertWebAddressHost = (
			host: WebAddressHost,
			{
				referenceCount,
				hostname,
			}: { referenceCount: number; hostname: string },
		): void => {
			expect(host.referenceCount).toBe(referenceCount);
			expect(host.hostname).toBe(hostname);
		};

		const assertWebAddress = (
			address: WebAddress,
			{
				referenceCount,
				url,
				scheme,
				host,
				port = '',
				path,
				query,
				fragment,
			}: {
				referenceCount: number;
				url: string;
				scheme: string;
				host: WebAddressHost;
				port?: string;
				path: string;
				query: string;
				fragment: string;
			},
		): void => {
			expect(address.referenceCount).toBe(referenceCount);
			expect(address.url).toBe(url);
			expect(address.scheme).toBe(scheme);
			expect(address.host.getEntity()).toBe(host);
			expect(address.host.getEntity().hostname).toBe(host.hostname);
			expect(address.port).toBe(port);
			expect(address.path).toBe(path);
			expect(address.query).toBe(query);
			expect(address.fragment).toBe(fragment);
		};

		const assertWebLink = (
			webLink: WebLink,
			{
				url,
				title,
				category,
			}: { url: string; title: string; category: WebLinkCategory },
		): void => {
			expect(webLink.url).toBe(url);
			expect(webLink.title).toBe(title);
			expect(webLink.category).toBe(category);
		};

		test('web links', async () => {
			const hosts = await em.getRepository(WebAddressHost).findAll();

			expect(hosts.length).toBe(3);

			assertWebAddressHost(hosts[0], {
				referenceCount: 1,
				hostname: 'yamatouta.net',
			});
			assertWebAddressHost(hosts[1], {
				referenceCount: 1,
				hostname: 'inishienomanabi.net',
			});
			assertWebAddressHost(hosts[2], {
				referenceCount: 2,
				hostname: 'ja.wikipedia.org',
			});

			const addresses = await em.getRepository(WebAddress).findAll();

			expect(addresses.length).toBe(4);

			assertWebAddress(addresses[0], {
				referenceCount: 1,
				url: 'https://yamatouta.net/translations/1',
				scheme: 'https',
				host: hosts[0],
				path: '/translations/1',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[1], {
				referenceCount: 1,
				url: 'https://inishienomanabi.net/translations/1/view',
				scheme: 'https',
				host: hosts[1],
				path: '/translations/1/view',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[2], {
				referenceCount: 1,
				url: 'https://ja.wikipedia.org/wiki/%E5%A4%A7%E5%92%8C%E8%A8%80%E8%91%89',
				scheme: 'https',
				host: hosts[2],
				path: '/wiki/%E5%A4%A7%E5%92%8C%E8%A8%80%E8%91%89',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[3], {
				referenceCount: 1,
				url: 'https://ja.wikipedia.org/wiki/%E5%92%8C%E6%AD%8C',
				scheme: 'https',
				host: hosts[2],
				path: '/wiki/%E5%92%8C%E6%AD%8C',
				query: '',
				fragment: '',
			});

			const webLinks = await em.getRepository(WebLink).findAll();

			expect(webLinks.length).toBe(4);

			assertWebLink(webLinks[0], {
				url: 'https://yamatouta.net/translations/1',
				title: 'やまとうた',
				category: WebLinkCategory.Reference,
			});
			assertWebLink(webLinks[1], {
				url: 'https://inishienomanabi.net/translations/1/view',
				title: 'いにしえのまなび',
				category: WebLinkCategory.Reference,
			});
			assertWebLink(webLinks[2], {
				url: 'https://ja.wikipedia.org/wiki/%E5%A4%A7%E5%92%8C%E8%A8%80%E8%91%89',
				title: 'Wikipedia (JA)',
				category: WebLinkCategory.Reference,
			});
			assertWebLink(webLinks[3], {
				url: 'https://ja.wikipedia.org/wiki/%E5%92%8C%E6%AD%8C',
				title: 'Wikipedia (JA)',
				category: WebLinkCategory.Reference,
			});
		});

		test('increment reference count', async () => {
			await webLinkService.sync(
				em,
				translation,
				[...defaultWebLinks, ...defaultWebLinks],
				permissionContext,
				existingUser,
			);

			const hosts = await em.getRepository(WebAddressHost).findAll();

			expect(hosts.length).toBe(3);

			assertWebAddressHost(hosts[0], {
				referenceCount: 2,
				hostname: 'yamatouta.net',
			});
			assertWebAddressHost(hosts[1], {
				referenceCount: 2,
				hostname: 'inishienomanabi.net',
			});
			assertWebAddressHost(hosts[2], {
				referenceCount: 4,
				hostname: 'ja.wikipedia.org',
			});

			const addresses = await em.getRepository(WebAddress).findAll();

			expect(addresses.length).toBe(4);

			assertWebAddress(addresses[0], {
				referenceCount: 2,
				url: 'https://yamatouta.net/translations/1',
				scheme: 'https',
				host: hosts[0],
				path: '/translations/1',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[1], {
				referenceCount: 2,
				url: 'https://inishienomanabi.net/translations/1/view',
				scheme: 'https',
				host: hosts[1],
				path: '/translations/1/view',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[2], {
				referenceCount: 2,
				url: 'https://ja.wikipedia.org/wiki/%E5%A4%A7%E5%92%8C%E8%A8%80%E8%91%89',
				scheme: 'https',
				host: hosts[2],
				path: '/wiki/%E5%A4%A7%E5%92%8C%E8%A8%80%E8%91%89',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[3], {
				referenceCount: 2,
				url: 'https://ja.wikipedia.org/wiki/%E5%92%8C%E6%AD%8C',
				scheme: 'https',
				host: hosts[2],
				path: '/wiki/%E5%92%8C%E6%AD%8C',
				query: '',
				fragment: '',
			});

			const webLinks = await em.getRepository(WebLink).findAll();

			expect(webLinks.length).toBe(8);

			for (let i = 0; i < 2; i++) {
				assertWebLink(webLinks[i * 4 + 0], {
					url: 'https://yamatouta.net/translations/1',
					title: 'やまとうた',
					category: WebLinkCategory.Reference,
				});
				assertWebLink(webLinks[i * 4 + 1], {
					url: 'https://inishienomanabi.net/translations/1/view',
					title: 'いにしえのまなび',
					category: WebLinkCategory.Reference,
				});
				assertWebLink(webLinks[i * 4 + 2], {
					url: 'https://ja.wikipedia.org/wiki/%E5%A4%A7%E5%92%8C%E8%A8%80%E8%91%89',
					title: 'Wikipedia (JA)',
					category: WebLinkCategory.Reference,
				});
				assertWebLink(webLinks[i * 4 + 3], {
					url: 'https://ja.wikipedia.org/wiki/%E5%92%8C%E6%AD%8C',
					title: 'Wikipedia (JA)',
					category: WebLinkCategory.Reference,
				});
			}
		});

		test('decrement reference count', async () => {
			await webLinkService.sync(
				em,
				translation,
				[],
				permissionContext,
				existingUser,
			);

			const hosts = await em.getRepository(WebAddressHost).findAll();

			expect(hosts.length).toBe(3);

			assertWebAddressHost(hosts[0], {
				referenceCount: 0,
				hostname: 'yamatouta.net',
			});
			assertWebAddressHost(hosts[1], {
				referenceCount: 0,
				hostname: 'inishienomanabi.net',
			});
			assertWebAddressHost(hosts[2], {
				referenceCount: 0,
				hostname: 'ja.wikipedia.org',
			});

			const addresses = await em.getRepository(WebAddress).findAll();

			expect(addresses.length).toBe(4);

			assertWebAddress(addresses[0], {
				referenceCount: 0,
				url: 'https://yamatouta.net/translations/1',
				scheme: 'https',
				host: hosts[0],
				path: '/translations/1',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[1], {
				referenceCount: 0,
				url: 'https://inishienomanabi.net/translations/1/view',
				scheme: 'https',
				host: hosts[1],
				path: '/translations/1/view',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[2], {
				referenceCount: 0,
				url: 'https://ja.wikipedia.org/wiki/%E5%A4%A7%E5%92%8C%E8%A8%80%E8%91%89',
				scheme: 'https',
				host: hosts[2],
				path: '/wiki/%E5%A4%A7%E5%92%8C%E8%A8%80%E8%91%89',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[3], {
				referenceCount: 0,
				url: 'https://ja.wikipedia.org/wiki/%E5%92%8C%E6%AD%8C',
				scheme: 'https',
				host: hosts[2],
				path: '/wiki/%E5%92%8C%E6%AD%8C',
				query: '',
				fragment: '',
			});

			const webLinks = await em.getRepository(WebLink).findAll();

			expect(webLinks.length).toBe(0);
		});

		test('update reference count', async () => {
			const oldWebLinks = await em.getRepository(WebLink).findAll();

			await webLinkService.sync(
				em,
				translation,
				[
					{
						id: oldWebLinks[0].id,
						url: 'https://ja.wikipedia.org/wiki/%E5%A4%A9%E7%85%A7%E5%A4%A7%E7%A5%9E',
						title: 'Wikipedia (JA)',
						category: WebLinkCategory.Reference,
					},
					{
						id: oldWebLinks[1].id,
						url: 'https://ja.wikipedia.org/wiki/%E3%82%A4%E3%82%B6%E3%83%8A%E3%83%9F',
						title: 'Wikipedia (JA)',
						category: WebLinkCategory.Reference,
					},
					{
						id: oldWebLinks[2].id,
						url: 'https://ja.wikipedia.org/wiki/%E3%82%A4%E3%82%B6%E3%83%8A%E3%82%AE',
						title: 'Wikipedia (JA)',
						category: WebLinkCategory.Reference,
					},
				],
				permissionContext,
				existingUser,
			);

			const hosts = await em.getRepository(WebAddressHost).findAll();

			expect(hosts.length).toBe(3);

			assertWebAddressHost(hosts[0], {
				referenceCount: 0,
				hostname: 'yamatouta.net',
			});
			assertWebAddressHost(hosts[1], {
				referenceCount: 0,
				hostname: 'inishienomanabi.net',
			});
			assertWebAddressHost(hosts[2], {
				referenceCount: 3,
				hostname: 'ja.wikipedia.org',
			});

			const addresses = await em.getRepository(WebAddress).findAll();

			expect(addresses.length).toBe(7);

			assertWebAddress(addresses[0], {
				referenceCount: 0,
				url: 'https://yamatouta.net/translations/1',
				scheme: 'https',
				host: hosts[0],
				path: '/translations/1',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[1], {
				referenceCount: 0,
				url: 'https://inishienomanabi.net/translations/1/view',
				scheme: 'https',
				host: hosts[1],
				path: '/translations/1/view',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[2], {
				referenceCount: 0,
				url: 'https://ja.wikipedia.org/wiki/%E5%A4%A7%E5%92%8C%E8%A8%80%E8%91%89',
				scheme: 'https',
				host: hosts[2],
				path: '/wiki/%E5%A4%A7%E5%92%8C%E8%A8%80%E8%91%89',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[3], {
				referenceCount: 0,
				url: 'https://ja.wikipedia.org/wiki/%E5%92%8C%E6%AD%8C',
				scheme: 'https',
				host: hosts[2],
				path: '/wiki/%E5%92%8C%E6%AD%8C',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[4], {
				referenceCount: 1,
				url: 'https://ja.wikipedia.org/wiki/%E5%A4%A9%E7%85%A7%E5%A4%A7%E7%A5%9E',
				scheme: 'https',
				host: hosts[2],
				path: '/wiki/%E5%A4%A9%E7%85%A7%E5%A4%A7%E7%A5%9E',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[5], {
				referenceCount: 1,
				url: 'https://ja.wikipedia.org/wiki/%E3%82%A4%E3%82%B6%E3%83%8A%E3%83%9F',
				scheme: 'https',
				host: hosts[2],
				path: '/wiki/%E3%82%A4%E3%82%B6%E3%83%8A%E3%83%9F',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[6], {
				referenceCount: 1,
				url: 'https://ja.wikipedia.org/wiki/%E3%82%A4%E3%82%B6%E3%83%8A%E3%82%AE',
				scheme: 'https',
				host: hosts[2],
				path: '/wiki/%E3%82%A4%E3%82%B6%E3%83%8A%E3%82%AE',
				query: '',
				fragment: '',
			});

			const webLinks = await em.getRepository(WebLink).findAll();

			expect(webLinks.length).toBe(3);

			assertWebLink(webLinks[0], {
				url: 'https://ja.wikipedia.org/wiki/%E5%A4%A9%E7%85%A7%E5%A4%A7%E7%A5%9E',
				title: 'Wikipedia (JA)',
				category: WebLinkCategory.Reference,
			});
			assertWebLink(webLinks[1], {
				url: 'https://ja.wikipedia.org/wiki/%E3%82%A4%E3%82%B6%E3%83%8A%E3%83%9F',
				title: 'Wikipedia (JA)',
				category: WebLinkCategory.Reference,
			});
			assertWebLink(webLinks[2], {
				url: 'https://ja.wikipedia.org/wiki/%E3%82%A4%E3%82%B6%E3%83%8A%E3%82%AE',
				title: 'Wikipedia (JA)',
				category: WebLinkCategory.Reference,
			});
		});

		test('host and port', async () => {
			await webLinkService.sync(
				em,
				translation,
				[
					{
						id: 0,
						url: 'http://localhost:3000',
						title: '',
						category: WebLinkCategory.Other,
					},
					{
						id: 0,
						url: 'http://localhost:5000',
						title: '',
						category: WebLinkCategory.Other,
					},
					{
						id: 0,
						url: 'http://localhost:8000',
						title: '',
						category: WebLinkCategory.Other,
					},
				],
				permissionContext,
				existingUser,
			);

			const hosts = await em.getRepository(WebAddressHost).findAll();

			expect(hosts.length).toBe(4);

			assertWebAddressHost(hosts[0], {
				referenceCount: 0,
				hostname: 'yamatouta.net',
			});
			assertWebAddressHost(hosts[1], {
				referenceCount: 0,
				hostname: 'inishienomanabi.net',
			});
			assertWebAddressHost(hosts[2], {
				referenceCount: 0,
				hostname: 'ja.wikipedia.org',
			});
			assertWebAddressHost(hosts[3], {
				referenceCount: 3,
				hostname: 'localhost',
			});

			const addresses = await em.getRepository(WebAddress).findAll();

			expect(addresses.length).toBe(7);

			assertWebAddress(addresses[0], {
				referenceCount: 0,
				url: 'https://yamatouta.net/translations/1',
				scheme: 'https',
				host: hosts[0],
				path: '/translations/1',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[1], {
				referenceCount: 0,
				url: 'https://inishienomanabi.net/translations/1/view',
				scheme: 'https',
				host: hosts[1],
				path: '/translations/1/view',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[2], {
				referenceCount: 0,
				url: 'https://ja.wikipedia.org/wiki/%E5%A4%A7%E5%92%8C%E8%A8%80%E8%91%89',
				scheme: 'https',
				host: hosts[2],
				path: '/wiki/%E5%A4%A7%E5%92%8C%E8%A8%80%E8%91%89',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[3], {
				referenceCount: 0,
				url: 'https://ja.wikipedia.org/wiki/%E5%92%8C%E6%AD%8C',
				scheme: 'https',
				host: hosts[2],
				path: '/wiki/%E5%92%8C%E6%AD%8C',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[4], {
				referenceCount: 1,
				url: 'http://localhost:3000/',
				scheme: 'http',
				host: hosts[3],
				port: '3000',
				path: '/',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[5], {
				referenceCount: 1,
				url: 'http://localhost:5000/',
				scheme: 'http',
				host: hosts[3],
				port: '5000',
				path: '/',
				query: '',
				fragment: '',
			});
			assertWebAddress(addresses[6], {
				referenceCount: 1,
				url: 'http://localhost:8000/',
				scheme: 'http',
				host: hosts[3],
				port: '8000',
				path: '/',
				query: '',
				fragment: '',
			});

			const webLinks = await em.getRepository(WebLink).findAll();

			expect(webLinks.length).toBe(3);

			assertWebLink(webLinks[0], {
				url: 'http://localhost:3000/',
				title: '',
				category: WebLinkCategory.Other,
			});
			assertWebLink(webLinks[1], {
				url: 'http://localhost:5000/',
				title: '',
				category: WebLinkCategory.Other,
			});
			assertWebLink(webLinks[2], {
				url: 'http://localhost:8000/',
				title: '',
				category: WebLinkCategory.Other,
			});
		});
	});
});
