import { TranslationObject } from '@/dto/TranslationObject';
import { Translation } from '@/entities/Translation';
import { WordCategory } from '@/models/translations/WordCategory';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { FakePermissionContext } from 'test/FakePermissionContext';
import { createApplication } from 'test/createApplication';
import { createTranslation, createUser } from 'test/createEntry';

describe('TranslationObject', () => {
	let app: INestApplication;
	let em: EntityManager;
	let translation: Translation;
	let deletedTranslation: Translation;
	let hiddenTranslation: Translation;
	let permissionContext: FakePermissionContext;

	beforeAll(async () => {
		app = await createApplication();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(async () => {
		em = app.get(EntityManager);

		const user = await createUser(em as any, {
			username: 'user',
			email: 'user@example.com',
		});

		translation = await createTranslation(em as any, {
			headword: '翻訳',
			locale: 'ja',
			reading: 'ほんやく',
			yamatokotoba: 'いいかえ',
			category: WordCategory.Noun,
			actor: user,
		});

		deletedTranslation = await createTranslation(em as any, {
			headword: '消された',
			locale: 'ja',
			reading: 'けされた',
			yamatokotoba: 'けされた',
			actor: user,
			deleted: true,
		});

		hiddenTranslation = await createTranslation(em as any, {
			headword: '隠された',
			locale: 'ja',
			reading: 'かくされた',
			yamatokotoba: 'かくされた',
			actor: user,
			hidden: true,
		});

		const viewer = await createUser(em as any, {
			username: 'viewer',
			email: 'viewer@example.com',
		});

		permissionContext = new FakePermissionContext(viewer);
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	test('create', () => {
		const translationObject = TranslationObject.create(
			permissionContext,
			translation,
		);
		expect(translationObject.id).toBe(translation.id);
		expect(translationObject.headword).toBe(
			translation.translatedString.headword,
		);
		expect(translationObject.locale).toBe(
			translation.translatedString.locale,
		);
		expect(translationObject.reading).toBe(
			translation.translatedString.reading,
		);
		expect(translationObject.yamatokotoba).toBe(
			translation.translatedString.yamatokotoba,
		);
		expect(translationObject.category).toBe(translation.category);

		expect(() =>
			TranslationObject.create(permissionContext, deletedTranslation),
		).toThrow(NotFoundException);

		expect(() =>
			TranslationObject.create(permissionContext, hiddenTranslation),
		).toThrow(NotFoundException);
	});
});
