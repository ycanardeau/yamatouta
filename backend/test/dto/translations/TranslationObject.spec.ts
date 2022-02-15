import { NotFoundException } from '@nestjs/common';

import { TranslationObject } from '../../../src/dto/translations/TranslationObject';
import { WordCategory } from '../../../src/models/WordCategory';
import { FakePermissionContext } from '../../FakePermissionContext';
import { createTranslation, createUser } from '../../createEntry';

test('TranslationObject', async () => {
	const user = await createUser({
		id: 1,
		username: 'user',
		email: 'user@example.com',
	});

	const translation = createTranslation({
		id: 2,
		headword: '翻訳',
		locale: 'ja',
		reading: 'ほんやく',
		yamatokotoba: 'いいかえ',
		category: WordCategory.Noun,
		user: user,
	});

	const deletedTranslation = createTranslation({
		id: 3,
		headword: '消された',
		locale: 'ja',
		reading: 'けされた',
		yamatokotoba: 'けされた',
		user: user,
		deleted: true,
	});

	const hiddenTranslation = createTranslation({
		id: 4,
		headword: '隠された',
		locale: 'ja',
		reading: 'かくされた',
		yamatokotoba: 'かくされた',
		user: user,
		hidden: true,
	});

	const viewer = await createUser({
		id: 5,
		username: 'viewer',
		email: 'viewer@example.com',
	});

	const permissionContext = new FakePermissionContext(viewer);

	const translationObject = new TranslationObject(
		translation,
		permissionContext,
	);
	expect(translationObject.id).toBe(translation.id);
	expect(translationObject.headword).toBe(
		translation.translatedString.headword,
	);
	expect(translationObject.locale).toBe(translation.translatedString.locale);
	expect(translationObject.reading).toBe(
		translation.translatedString.reading,
	);
	expect(translationObject.yamatokotoba).toBe(
		translation.translatedString.yamatokotoba,
	);
	expect(translationObject.category).toBe(translation.category);

	expect(
		() => new TranslationObject(deletedTranslation, permissionContext),
	).toThrow(NotFoundException);

	expect(
		() => new TranslationObject(hiddenTranslation, permissionContext),
	).toThrow(NotFoundException);
});
