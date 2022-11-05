import { WorkObject } from '@/dto/WorkObject';
import { Work } from '@/entities/Work';
import { WorkType } from '@/models/works/WorkType';
import { PermissionContext } from '@/services/PermissionContext';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { FakePermissionContext } from 'test/FakePermissionContext';
import { createApplication } from 'test/createApplication';
import { createUser, createWork } from 'test/createEntry';

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
		const workObject = WorkObject.create(permissionContext, work);
		expect(workObject.id).toBe(work.id);
		expect(workObject.name).toBe(work.name);
		expect(workObject.workType).toBe(work.workType);

		expect(() => WorkObject.create(permissionContext, deletedWork)).toThrow(
			NotFoundException,
		);

		expect(() => WorkObject.create(permissionContext, hiddenWork)).toThrow(
			NotFoundException,
		);
	});
});
