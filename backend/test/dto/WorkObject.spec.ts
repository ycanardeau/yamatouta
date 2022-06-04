import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication, NotFoundException } from '@nestjs/common';

import { WorkObject } from '../../src/dto/WorkObject';
import { Work } from '../../src/entities/Work';
import { WorkType } from '../../src/models/works/WorkType';
import { PermissionContext } from '../../src/services/PermissionContext';
import { FakePermissionContext } from '../FakePermissionContext';
import { createApplication } from '../createApplication';
import { createUser, createWork } from '../createEntry';

describe('WorkObject', () => {
	let app: INestApplication;
	let em: EntityManager;
	let work: Work;
	let deletedWork: Work;
	let hiddenWork: Work;
	let permissionContext: PermissionContext;

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

		work = await createWork(em as any, {
			name: 'work',
			workType: WorkType.Book,
			actor: user,
		});

		deletedWork = await createWork(em as any, {
			name: 'deleted',
			workType: WorkType.Book,
			actor: user,
			deleted: true,
		});

		hiddenWork = await createWork(em as any, {
			name: 'hidden',
			workType: WorkType.Book,
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
		const workObject = WorkObject.create(work, permissionContext);
		expect(workObject.id).toBe(work.id);
		expect(workObject.name).toBe(work.name);
		expect(workObject.workType).toBe(work.workType);

		expect(() => WorkObject.create(deletedWork, permissionContext)).toThrow(
			NotFoundException,
		);

		expect(() => WorkObject.create(hiddenWork, permissionContext)).toThrow(
			NotFoundException,
		);
	});
});
