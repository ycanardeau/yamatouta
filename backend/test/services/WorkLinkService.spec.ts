import { EntityManager, MikroORM } from '@mikro-orm/core';
import { BadRequestException, INestApplication } from '@nestjs/common';
import _ from 'lodash';

import { Artist } from '../../src/entities/Artist';
import { Quote } from '../../src/entities/Quote';
import { User } from '../../src/entities/User';
import { Work } from '../../src/entities/Work';
import { WorkLink } from '../../src/entities/WorkLink';
import { EntryType } from '../../src/models/EntryType';
import { LinkType, workLinkTypes } from '../../src/models/LinkType';
import { UserGroup } from '../../src/models/UserGroup';
import { WorkLinkUpdateParams } from '../../src/models/WorkLinkUpdateParams';
import { ArtistType } from '../../src/models/artists/ArtistType';
import { QuoteType } from '../../src/models/quotes/QuoteType';
import { WorkType } from '../../src/models/works/WorkType';
import { WorkLinkService } from '../../src/services/WorkLinkService';
import { FakePermissionContext } from '../FakePermissionContext';
import { createApplication } from '../createApplication';
import {
	createArtist,
	createQuote,
	createUser,
	createWork,
} from '../createEntry';

describe('WorkLinkService', () => {
	describe('sync', () => {
		let app: INestApplication;
		let workLinkService: WorkLinkService;
		let em: EntityManager;
		let existingUser: User;
		let artist: Artist;
		let quote: Quote;
		let permissionContext: FakePermissionContext;

		let kiminihare: Work;
		let yunagi: Work;
		let usotsuki: Work;

		let defaultWorkLinks: WorkLinkUpdateParams[];

		beforeAll(async () => {
			app = await createApplication();
		});

		afterAll(async () => {
			await app.close();
		});

		beforeEach(async () => {
			workLinkService = app.get(WorkLinkService);
			em = app.get(EntityManager);

			existingUser = await createUser(em, {
				username: 'existing',
				email: 'existing@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.Admin,
			});

			artist = await createArtist(em, {
				name: 'よるしか',
				artistType: ArtistType.Group,
				actor: existingUser,
			});

			quote = await createQuote(em, {
				quoteType: QuoteType.Lyrics,
				text: '絶えず君のいこふ 記憶に夏野の石一つ',
				locale: 'ja',
				artist: artist,
				actor: existingUser,
			});

			permissionContext = new FakePermissionContext(existingUser);

			[kiminihare, yunagi, usotsuki] = await Promise.all(
				[
					{
						name: 'ただきみにはれ',
						workType: WorkType.Song,
						actor: existingUser,
					},
					{
						name: 'ゆうなぎ、なにがし、はなまどい',
						workType: WorkType.Song,
						actor: existingUser,
					},
					{
						name: 'うそつき',
						workType: WorkType.Song,
						actor: existingUser,
					},
				].map((work) => createWork(em, work)),
			);

			defaultWorkLinks = [
				{
					id: 0,
					relatedWorkId: kiminihare.id,
					linkType: LinkType.Quote_Work_Source,
					beginDate: {},
					endDate: {},
					ended: false,
				},
				{
					id: 0,
					relatedWorkId: yunagi.id,
					linkType: LinkType.Quote_Work_Source,
					beginDate: { year: 1, month: 2, day: 3 },
					endDate: {},
					ended: true,
				},
				{
					id: 0,
					relatedWorkId: usotsuki.id,
					linkType: LinkType.Quote_Work_Source,
					beginDate: { year: 4, month: 6, day: 7 },
					endDate: { year: 8, month: 9, day: 10 },
					ended: true,
				},
			];
		});

		afterEach(async () => {
			const orm = app.get(MikroORM);
			const generator = orm.getSchemaGenerator();

			await generator.clearDatabase();
		});

		beforeEach(async () => {
			await workLinkService.sync(
				em,
				quote,
				defaultWorkLinks,
				permissionContext,
			);

			await em.flush();
		});

		const assertWorkLink = (
			workLink: WorkLink,
			{
				relatedWork,
				linkType,
				beginDate,
				endDate,
				ended,
			}: {
				relatedWork: Work;
				linkType: LinkType;
				beginDate: { year?: number; month?: number; day?: number };
				endDate: { year?: number; month?: number; day?: number };
				ended: boolean;
			},
		): void => {
			expect(workLink.relatedWork.getEntity()).toBe(relatedWork);
			expect(workLink.linkType).toBe(linkType);
			expect(workLink.beginDate.year).toBe(beginDate.year);
			expect(workLink.beginDate.month).toBe(beginDate.month);
			expect(workLink.beginDate.day).toBe(beginDate.day);
			expect(workLink.endDate.year).toBe(endDate.year);
			expect(workLink.endDate.month).toBe(endDate.month);
			expect(workLink.endDate.day).toBe(endDate.day);
			expect(workLink.ended).toBe(ended);
		};

		test('work links', async () => {
			const workLinks = await em.getRepository(WorkLink).findAll();

			expect(workLinks.length).toBe(3);

			assertWorkLink(workLinks[0], {
				relatedWork: kiminihare,
				linkType: LinkType.Quote_Work_Source,
				beginDate: {},
				endDate: {},
				ended: false,
			});
			assertWorkLink(workLinks[1], {
				relatedWork: yunagi,
				linkType: LinkType.Quote_Work_Source,
				beginDate: { year: 1, month: 2, day: 3 },
				endDate: {},
				ended: true,
			});
			assertWorkLink(workLinks[2], {
				relatedWork: usotsuki,
				linkType: LinkType.Quote_Work_Source,
				beginDate: { year: 4, month: 6, day: 7 },
				endDate: { year: 8, month: 9, day: 10 },
				ended: true,
			});
		});

		test('invalid link types', async () => {
			const invalidLinkTypes = _.difference(
				Object.values(LinkType),
				workLinkTypes[EntryType.Quote],
			);

			for (const linkType of invalidLinkTypes) {
				expect(() =>
					workLinkService.sync(
						em,
						quote,
						[
							{
								id: 0,
								relatedWorkId: kiminihare.id,
								linkType: linkType,
								beginDate: {},
								endDate: {},
								ended: false,
							},
						],
						permissionContext,
					),
				).rejects.toThrow(BadRequestException);
			}
		});
	});
});
