import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import { TranslationAuditLogEntry } from '../../../src/entities/AuditLogEntry';
import { ChangeLogChange } from '../../../src/entities/ChangeLogChange';
import { TranslationChangeLogEntry } from '../../../src/entities/ChangeLogEntry';
import { Revision } from '../../../src/entities/Revision';
import { Translation } from '../../../src/entities/Translation';
import { User } from '../../../src/entities/User';
import { NgramConverter } from '../../../src/helpers/NgramConverter';
import { AuditedAction } from '../../../src/models/AuditedAction';
import { ChangeLogChangeKey } from '../../../src/models/ChangeLogChangeKey';
import { ChangeLogEvent } from '../../../src/models/ChangeLogEvent';
import { UserGroup } from '../../../src/models/UserGroup';
import { WordCategory } from '../../../src/models/WordCategory';
import { IUpdateTranslationBody } from '../../../src/requests/translations/IUpdateTranslationBody';
import { AuditLogService } from '../../../src/services/AuditLogService';
import { UpdateTranslationService } from '../../../src/services/translations/UpdateTranslationService';
import { FakeEntityManager } from '../../FakeEntityManager';
import { FakePermissionContext } from '../../FakePermissionContext';
import { createTranslation, createUser } from '../../createEntry';
import { testTranslationAuditLogEntry } from '../../testAuditLogEntry';

describe('UpdateTranslationService', () => {
	let em: FakeEntityManager;
	let existingUser: User;
	let translation: Translation;
	let userRepo: any;
	let auditLogService: AuditLogService;
	let ngramConverter: NgramConverter;
	let translationRepo: any;
	let permissionContext: FakePermissionContext;
	let updateTranslationService: UpdateTranslationService;

	beforeAll(async () => {
		// See https://stackoverflow.com/questions/69924546/unit-testing-mirkoorm-entities.
		await MikroORM.init(undefined, false);
	});

	beforeEach(async () => {
		const existingUsername = 'existing';
		const existingEmail = 'existing@example.com';

		existingUser = await createUser({
			id: 1,
			username: existingUsername,
			email: existingEmail,
			password: 'P@$$w0rd',
			userGroup: UserGroup.Admin,
		});

		translation = createTranslation({
			id: 2,
			headword: '大和言葉',
			locale: 'ojp',
			reading: 'やまとことば',
			yamatokotoba: 'やまとことば',
			user: existingUser,
		});

		em = new FakeEntityManager();
		userRepo = {
			findOneOrFail: async (): Promise<User> => existingUser,
			findOne: async (where: any): Promise<User> =>
				[existingUser].filter(
					(u) => u.normalizedEmail === where.normalizedEmail,
				)[0],
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			persist: (): void => {},
		};
		auditLogService = new AuditLogService(em as any);
		ngramConverter = new NgramConverter();
		translationRepo = {
			findOneOrFail: async (): Promise<Translation> => translation,
		};

		permissionContext = new FakePermissionContext(existingUser);

		updateTranslationService = new UpdateTranslationService(
			em as any,
			permissionContext,
			userRepo as any,
			auditLogService,
			ngramConverter,
			translationRepo as any,
		);
	});

	describe('updateTranslation', () => {
		const testUpdateTranslation = async (
			body: IUpdateTranslationBody,
			expectedChanges: Pick<ChangeLogChange, 'key' | 'value'>[],
		): Promise<void> => {
			const translationObject =
				await updateTranslationService.updateTranslation(
					translation.id,
					body,
				);

			expect(translationObject.headword).toBe(body.headword);
			expect(translationObject.locale).toBe(body.locale);
			expect(translationObject.reading).toBe(body.reading);
			expect(translationObject.yamatokotoba).toBe(body.yamatokotoba);
			expect(translationObject.category).toBe(body.category);

			const revision = em.entities.filter(
				(entity) => entity instanceof Revision,
			)[0] as Revision;

			expect(revision).toBeInstanceOf(Revision);
			expect(revision.changeLogEntries.length).toBe(1);

			const changeLogEntry = revision
				.changeLogEntries[0] as TranslationChangeLogEntry;
			expect(changeLogEntry).toBeInstanceOf(TranslationChangeLogEntry);

			expect(changeLogEntry.revision.getEntity()).toBe(revision);
			expect(changeLogEntry.changes.length).toBe(expectedChanges.length);
			expect(changeLogEntry.actor).toBe(existingUser);
			expect(changeLogEntry.actionType).toBe(ChangeLogEvent.Updated);
			expect(changeLogEntry.translation).toBe(translation);

			for (let i = 0; i < changeLogEntry.changes.length; i++) {
				const changeLogChange = changeLogEntry.changes[i];
				expect(changeLogChange).toBeInstanceOf(ChangeLogChange);
				expect(changeLogChange.changeLogEntry).toBe(changeLogEntry);

				const { key, value } = expectedChanges[i];
				expect(changeLogChange.key).toBe(key);
				expect(changeLogChange.value).toBe(value);
			}

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof TranslationAuditLogEntry,
			)[0] as TranslationAuditLogEntry;

			testTranslationAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Translation_Update,
				actor: existingUser,
				actorIp: permissionContext.remoteIpAddress,
				oldValue: '',
				newValue: '',
				translation: translation,
			});
		};

		const defaults = {
			headword: '和語',
			locale: 'ja',
			reading: 'わご',
			yamatokotoba: 'やまとことのは',
			category: WordCategory.Noun,
		};

		test('insufficient permission', async () => {
			const userGroups = Object.values(UserGroup).filter(
				(userGroup) => userGroup !== UserGroup.Admin,
			);

			for (const userGroup of userGroups) {
				existingUser.userGroup = userGroup;

				const permissionContext = new FakePermissionContext(
					existingUser,
				);

				updateTranslationService = new UpdateTranslationService(
					em as any,
					permissionContext,
					userRepo as any,
					auditLogService,
					ngramConverter,
					translationRepo as any,
				);

				await expect(
					updateTranslationService.updateTranslation(
						translation.id,
						defaults,
					),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('0 changes', async () => {
			await testUpdateTranslation(
				{
					headword: translation.headword,
					locale: translation.locale,
					reading: translation.reading,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
				},
				[],
			);
		});

		test('1 change', async () => {
			await testUpdateTranslation(
				{
					...defaults,
					locale: translation.locale,
					reading: translation.reading,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
				},
				[
					{
						key: ChangeLogChangeKey.Translation_Headword,
						value: defaults.headword,
					},
				],
			);
		});

		test('2 changes', async () => {
			await testUpdateTranslation(
				{
					...defaults,
					reading: translation.reading,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
				},
				[
					{
						key: ChangeLogChangeKey.Translation_Headword,
						value: defaults.headword,
					},
					{
						key: ChangeLogChangeKey.Translation_Locale,
						value: defaults.locale,
					},
				],
			);
		});

		test('3 changes', async () => {
			await testUpdateTranslation(
				{
					...defaults,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
				},
				[
					{
						key: ChangeLogChangeKey.Translation_Headword,
						value: defaults.headword,
					},
					{
						key: ChangeLogChangeKey.Translation_Locale,
						value: defaults.locale,
					},
					{
						key: ChangeLogChangeKey.Translation_Reading,
						value: defaults.reading,
					},
				],
			);
		});

		test('4 changes', async () => {
			await testUpdateTranslation(
				{ ...defaults, category: translation.category },
				[
					{
						key: ChangeLogChangeKey.Translation_Headword,
						value: defaults.headword,
					},
					{
						key: ChangeLogChangeKey.Translation_Locale,
						value: defaults.locale,
					},
					{
						key: ChangeLogChangeKey.Translation_Reading,
						value: defaults.reading,
					},
					{
						key: ChangeLogChangeKey.Translation_Yamatokotoba,
						value: defaults.yamatokotoba,
					},
				],
			);
		});

		test('5 changes', async () => {
			await testUpdateTranslation(defaults, [
				{
					key: ChangeLogChangeKey.Translation_Headword,
					value: defaults.headword,
				},
				{
					key: ChangeLogChangeKey.Translation_Locale,
					value: defaults.locale,
				},
				{
					key: ChangeLogChangeKey.Translation_Reading,
					value: defaults.reading,
				},
				{
					key: ChangeLogChangeKey.Translation_Yamatokotoba,
					value: defaults.yamatokotoba,
				},
				{
					key: ChangeLogChangeKey.Translation_Category,
					value: defaults.category,
				},
			]);
		});

		test('headword is undefined', async () => {
			await expect(
				updateTranslationService.updateTranslation(translation.id, {
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					headword: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('headword is empty', async () => {
			await expect(
				updateTranslationService.updateTranslation(translation.id, {
					...defaults,
					headword: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('headword is too long', async () => {
			await expect(
				updateTranslationService.updateTranslation(translation.id, {
					...defaults,
					headword: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading is undefined', async () => {
			await expect(
				updateTranslationService.updateTranslation(translation.id, {
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					reading: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading is empty', async () => {
			await expect(
				updateTranslationService.updateTranslation(translation.id, {
					...defaults,
					reading: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading is too long', async () => {
			await expect(
				updateTranslationService.updateTranslation(translation.id, {
					...defaults,
					reading: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading contains alphabets', async () => {
			await expect(
				updateTranslationService.updateTranslation(translation.id, {
					...defaults,
					reading: 'Anglish',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading contains kanji', async () => {
			await expect(
				updateTranslationService.updateTranslation(translation.id, {
					...defaults,
					reading: '大和言葉',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba is undefined', async () => {
			await expect(
				updateTranslationService.updateTranslation(translation.id, {
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					yamatokotoba: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba is empty', async () => {
			await expect(
				updateTranslationService.updateTranslation(translation.id, {
					...defaults,
					yamatokotoba: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba is too long', async () => {
			await expect(
				updateTranslationService.updateTranslation(translation.id, {
					...defaults,
					yamatokotoba: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba contains alphabets', async () => {
			await expect(
				updateTranslationService.updateTranslation(translation.id, {
					...defaults,
					yamatokotoba: 'Anglish',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba contains kanji', async () => {
			await expect(
				updateTranslationService.updateTranslation(translation.id, {
					...defaults,
					yamatokotoba: '大和言葉',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('category is empty', async () => {
			await expect(
				updateTranslationService.updateTranslation(translation.id, {
					...defaults,
					category: '' as WordCategory,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('category is invalid', async () => {
			await expect(
				updateTranslationService.updateTranslation(translation.id, {
					...defaults,
					category: 'abcdef' as WordCategory,
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});
