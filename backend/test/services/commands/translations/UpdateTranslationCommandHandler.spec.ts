import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import { TranslationAuditLogEntry } from '../../../../src/entities/AuditLogEntry';
import { TranslationRevision } from '../../../../src/entities/Revision';
import { Translation } from '../../../../src/entities/Translation';
import { User } from '../../../../src/entities/User';
import { AuditedAction } from '../../../../src/models/AuditedAction';
import { RevisionEvent } from '../../../../src/models/RevisionEvent';
import { TranslationSnapshot } from '../../../../src/models/Snapshot';
import { UserGroup } from '../../../../src/models/UserGroup';
import { WordCategory } from '../../../../src/models/WordCategory';
import { AuditLogger } from '../../../../src/services/AuditLogger';
import { NgramConverter } from '../../../../src/services/NgramConverter';
import {
	UpdateTranslationCommand,
	UpdateTranslationCommandHandler,
} from '../../../../src/services/commands/translations/UpdateTranslationCommandHandler';
import { FakeEntityManager } from '../../../FakeEntityManager';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { createTranslation, createUser } from '../../../createEntry';
import { testTranslationAuditLogEntry } from '../../../testAuditLogEntry';

describe('UpdateTranslationCommandHandler', () => {
	let em: FakeEntityManager;
	let existingUser: User;
	let translation: Translation;
	let userRepo: any;
	let auditLogger: AuditLogger;
	let ngramConverter: NgramConverter;
	let translationRepo: any;
	let permissionContext: FakePermissionContext;
	let updateTranslationCommandHandler: UpdateTranslationCommandHandler;

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
			persist: (): void => {},
		};
		auditLogger = new AuditLogger(em as any);
		ngramConverter = new NgramConverter();
		translationRepo = {
			findOneOrFail: async (): Promise<Translation> => translation,
		};

		permissionContext = new FakePermissionContext(existingUser);

		updateTranslationCommandHandler = new UpdateTranslationCommandHandler(
			em as any,
			permissionContext,
			userRepo as any,
			auditLogger,
			ngramConverter,
			translationRepo as any,
		);
	});

	describe('updateTranslation', () => {
		const testUpdateTranslation = async ({
			command,
			snapshot,
		}: {
			command: UpdateTranslationCommand;
			snapshot: TranslationSnapshot;
		}): Promise<void> => {
			const translationObject =
				await updateTranslationCommandHandler.execute(
					translation.id,
					command,
				);

			expect(translationObject.headword).toBe(command.headword);
			expect(translationObject.locale).toBe(command.locale);
			expect(translationObject.reading).toBe(command.reading);
			expect(translationObject.yamatokotoba).toBe(command.yamatokotoba);
			expect(translationObject.category).toBe(command.category);

			const revision = em.entities.filter(
				(entity) => entity instanceof TranslationRevision,
			)[0] as TranslationRevision;

			expect(revision).toBeInstanceOf(TranslationRevision);
			expect(revision.translation).toBe(translation);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Updated);
			expect(JSON.stringify(revision.snapshot)).toBe(
				JSON.stringify(snapshot),
			);

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

				updateTranslationCommandHandler =
					new UpdateTranslationCommandHandler(
						em as any,
						permissionContext,
						userRepo as any,
						auditLogger,
						ngramConverter,
						translationRepo as any,
					);

				await expect(
					updateTranslationCommandHandler.execute(
						translation.id,
						defaults,
					),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('0 changes', async () => {
			await testUpdateTranslation({
				command: {
					headword: translation.headword,
					locale: translation.locale,
					reading: translation.reading,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
				},
				snapshot: {
					headword: translation.headword,
					locale: translation.locale,
					reading: translation.reading,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
					inishienomanabi_tags: [],
				},
			});
		});

		test('1 change', async () => {
			await testUpdateTranslation({
				command: {
					...defaults,
					locale: translation.locale,
					reading: translation.reading,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
				},
				snapshot: {
					headword: defaults.headword,
					locale: translation.locale,
					reading: translation.reading,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
					inishienomanabi_tags: [],
				},
			});
		});

		test('2 changes', async () => {
			await testUpdateTranslation({
				command: {
					...defaults,
					reading: translation.reading,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
				},
				snapshot: {
					headword: defaults.headword,
					locale: defaults.locale,
					reading: translation.reading,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
					inishienomanabi_tags: [],
				},
			});
		});

		test('3 changes', async () => {
			await testUpdateTranslation({
				command: {
					...defaults,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
				},
				snapshot: {
					headword: defaults.headword,
					locale: defaults.locale,
					reading: defaults.reading,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
					inishienomanabi_tags: [],
				},
			});
		});

		test('4 changes', async () => {
			await testUpdateTranslation({
				command: { ...defaults, category: translation.category },
				snapshot: {
					headword: defaults.headword,
					locale: defaults.locale,
					reading: defaults.reading,
					yamatokotoba: defaults.yamatokotoba,
					category: translation.category,
					inishienomanabi_tags: [],
				},
			});
		});

		test('5 changes', async () => {
			await testUpdateTranslation({
				command: defaults,
				snapshot: {
					headword: defaults.headword,
					locale: defaults.locale,
					reading: defaults.reading,
					yamatokotoba: defaults.yamatokotoba,
					category: defaults.category,
					inishienomanabi_tags: [],
				},
			});
		});

		test('headword is undefined', async () => {
			await expect(
				updateTranslationCommandHandler.execute(translation.id, {
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					headword: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('headword is empty', async () => {
			await expect(
				updateTranslationCommandHandler.execute(translation.id, {
					...defaults,
					headword: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('headword is too long', async () => {
			await expect(
				updateTranslationCommandHandler.execute(translation.id, {
					...defaults,
					headword: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading is undefined', async () => {
			await expect(
				updateTranslationCommandHandler.execute(translation.id, {
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					reading: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading is empty', async () => {
			await expect(
				updateTranslationCommandHandler.execute(translation.id, {
					...defaults,
					reading: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading is too long', async () => {
			await expect(
				updateTranslationCommandHandler.execute(translation.id, {
					...defaults,
					reading: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading contains alphabets', async () => {
			await expect(
				updateTranslationCommandHandler.execute(translation.id, {
					...defaults,
					reading: 'Anglish',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading contains kanji', async () => {
			await expect(
				updateTranslationCommandHandler.execute(translation.id, {
					...defaults,
					reading: '大和言葉',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba is undefined', async () => {
			await expect(
				updateTranslationCommandHandler.execute(translation.id, {
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					yamatokotoba: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba is empty', async () => {
			await expect(
				updateTranslationCommandHandler.execute(translation.id, {
					...defaults,
					yamatokotoba: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba is too long', async () => {
			await expect(
				updateTranslationCommandHandler.execute(translation.id, {
					...defaults,
					yamatokotoba: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba contains alphabets', async () => {
			await expect(
				updateTranslationCommandHandler.execute(translation.id, {
					...defaults,
					yamatokotoba: 'Anglish',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba contains kanji', async () => {
			await expect(
				updateTranslationCommandHandler.execute(translation.id, {
					...defaults,
					yamatokotoba: '大和言葉',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('category is empty', async () => {
			await expect(
				updateTranslationCommandHandler.execute(translation.id, {
					...defaults,
					category: '' as WordCategory,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('category is invalid', async () => {
			await expect(
				updateTranslationCommandHandler.execute(translation.id, {
					...defaults,
					category: 'abcdef' as WordCategory,
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});
