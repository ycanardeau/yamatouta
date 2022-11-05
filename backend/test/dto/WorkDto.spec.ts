import { WorkDto } from '@/dto/WorkDto';
import { Work } from '@/entities/Work';
import { WorkType } from '@/models/works/WorkType';
import { PermissionContext } from '@/services/PermissionContext';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { FakePermissionContext } from 'test/FakePermissionContext';
import { createApplication } from 'test/createApplication';
import { createUser, createWork } from 'test/createEntry';

describe('WorkDto', () => {
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
		const workDto = WorkDto.create(permissionContext, work);
		expect(workDto.id).toBe(work.id);
		expect(workDto.name).toBe(work.name);
		expect(workDto.workType).toBe(work.workType);

		expect(() => WorkDto.create(permissionContext, deletedWork)).toThrow(
			NotFoundException,
		);

		expect(() => WorkDto.create(permissionContext, hiddenWork)).toThrow(
			NotFoundException,
		);
	});
});
