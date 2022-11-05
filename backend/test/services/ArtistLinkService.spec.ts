import { Artist } from '@/entities/Artist';
import { ArtistLink } from '@/entities/ArtistLink';
import { User } from '@/entities/User';
import { Work } from '@/entities/Work';
import { ArtistLinkUpdateParams } from '@/models/ArtistLinkUpdateParams';
import { EntryType } from '@/models/EntryType';
import { artistLinkTypes, LinkType } from '@/models/LinkType';
import { ArtistType } from '@/models/artists/ArtistType';
import { UserGroup } from '@/models/users/UserGroup';
import { WorkType } from '@/models/works/WorkType';
import { ArtistLinkService } from '@/services/ArtistLinkService';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { BadRequestException, INestApplication } from '@nestjs/common';
import _ from 'lodash';
import { FakePermissionContext } from 'test/FakePermissionContext';
import { createApplication } from 'test/createApplication';
import { createArtist, createUser, createWork } from 'test/createEntry';

describe('ArtistLinkService', () => {
	describe('sync', () => {
		let app: INestApplication;
		let artistLinkService: ArtistLinkService;
		let em: EntityManager;
		let existingUser: User;
		let work: Work;
		let permissionContext: FakePermissionContext;

		let amaterasu: Artist;
		let izanami: Artist;
		let izanagi: Artist;

		let defaultArtistLinks: ArtistLinkUpdateParams[];

		beforeAll(async () => {
			app = await createApplication();
		});

		afterAll(async () => {
			await app.close();
		});

		beforeEach(async () => {
			artistLinkService = app.get(ArtistLinkService);
			em = app.get(EntityManager);

			existingUser = await createUser(em, {
				username: 'existing',
				email: 'existing@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.Admin,
			});

			work = await createWork(em, {
				name: '日本神話',
				workType: WorkType.Book,
				actor: existingUser,
			});

			permissionContext = new FakePermissionContext(existingUser);

			[amaterasu, izanami, izanagi] = await Promise.all(
				[
					{
						name: 'あまてらす',
						artistType: ArtistType.Character,
						actor: existingUser,
					},
					{
						name: 'いざなみ',
						artistType: ArtistType.Character,
						actor: existingUser,
					},
					{
						name: 'いざなぎ',
						artistType: ArtistType.Character,
						actor: existingUser,
					},
				].map((artist) => createArtist(em, artist)),
			);

			defaultArtistLinks = [
				{
					id: 0,
					relatedArtistId: amaterasu.id,
					linkType: LinkType.Work_Artist_Author,
					beginDate: {},
					endDate: {},
					ended: false,
				},
				{
					id: 0,
					relatedArtistId: izanami.id,
					linkType: LinkType.Work_Artist_Contributor,
					beginDate: { year: 1, month: 2, day: 3 },
					endDate: {},
					ended: true,
				},
				{
					id: 0,
					relatedArtistId: izanagi.id,
					linkType: LinkType.Work_Artist_Editor,
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
			await artistLinkService.sync(
				em,
				work,
				defaultArtistLinks,
				permissionContext,
			);

			await em.flush();
		});

		const assertArtistLink = (
			artistLink: ArtistLink,
			{
				relatedArtist,
				linkType,
				beginDate,
				endDate,
				ended,
			}: {
				relatedArtist: Artist;
				linkType: LinkType;
				beginDate: { year?: number; month?: number; day?: number };
				endDate: { year?: number; month?: number; day?: number };
				ended: boolean;
			},
		): void => {
			expect(artistLink.relatedArtist.getEntity()).toBe(relatedArtist);
			expect(artistLink.linkType).toBe(linkType);
			expect(artistLink.beginDate.year).toBe(beginDate.year);
			expect(artistLink.beginDate.month).toBe(beginDate.month);
			expect(artistLink.beginDate.day).toBe(beginDate.day);
			expect(artistLink.endDate.year).toBe(endDate.year);
			expect(artistLink.endDate.month).toBe(endDate.month);
			expect(artistLink.endDate.day).toBe(endDate.day);
			expect(artistLink.ended).toBe(ended);
		};

		test('artist links', async () => {
			const artistLinks = await em.getRepository(ArtistLink).findAll();

			expect(artistLinks.length).toBe(3);

			assertArtistLink(artistLinks[0], {
				relatedArtist: amaterasu,
				linkType: LinkType.Work_Artist_Author,
				beginDate: {},
				endDate: {},
				ended: false,
			});
			assertArtistLink(artistLinks[1], {
				relatedArtist: izanami,
				linkType: LinkType.Work_Artist_Contributor,
				beginDate: { year: 1, month: 2, day: 3 },
				endDate: {},
				ended: true,
			});
			assertArtistLink(artistLinks[2], {
				relatedArtist: izanagi,
				linkType: LinkType.Work_Artist_Editor,
				beginDate: { year: 4, month: 6, day: 7 },
				endDate: { year: 8, month: 9, day: 10 },
				ended: true,
			});
		});

		test('invalid link types', async () => {
			const invalidLinkTypes = _.difference(
				Object.values(LinkType),
				artistLinkTypes[EntryType.Work],
			);

			for (const linkType of invalidLinkTypes) {
				expect(() =>
					artistLinkService.sync(
						em,
						work,
						[
							{
								id: 0,
								relatedArtistId: amaterasu.id,
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
