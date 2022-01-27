import { NotFoundException } from '@nestjs/common';

import { TranslationObject } from '../../../src/dto/translations/TranslationObject';
import { AuthenticatedUserObject } from '../../../src/dto/users/AuthenticatedUserObject';
import { Translation } from '../../../src/entities/Translation';
import { User } from '../../../src/entities/User';
import { PasswordHashAlgorithm } from '../../../src/models/PasswordHashAlgorithm';
import { WordCategory } from '../../../src/models/WordCategory';
import { PermissionContext } from '../../../src/services/PermissionContext';

test('TranslationObject', () => {
	const user = new User({
		name: 'user',
		email: 'user@example.com',
		normalizedEmail: '',
		passwordHashAlgorithm: PasswordHashAlgorithm.Bcrypt,
		salt: '',
		passwordHash: '',
	});
	user.id = 1;

	const translation = new Translation({
		translatedString: {
			headword: '翻訳',
			locale: 'ja',
			reading: 'ほんやく',
			yamatokotoba: 'いいかえ',
		},
		category: WordCategory.Noun,
		user: user,
	});
	translation.id = 2;

	const deletedTranslation = new Translation({
		translatedString: {
			headword: '消された',
			locale: 'ja',
			reading: 'けされた',
			yamatokotoba: 'けされた',
		},
		user: user,
	});
	deletedTranslation.id = 3;
	deletedTranslation.deleted = true;

	const hiddenTranslation = new Translation({
		translatedString: {
			headword: '隠された',
			locale: 'ja',
			reading: 'かくされた',
			yamatokotoba: 'かくされた',
		},
		user: user,
	});
	hiddenTranslation.id = 4;
	hiddenTranslation.hidden = true;

	const viewer = new User({
		name: 'viewer',
		email: 'viewer@example.com',
		normalizedEmail: '',
		passwordHashAlgorithm: PasswordHashAlgorithm.Bcrypt,
		salt: '',
		passwordHash: '',
	});
	viewer.id = 5;

	const permissionContext = new PermissionContext({
		user: new AuthenticatedUserObject(viewer),
	} as any);

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
