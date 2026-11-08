import { toQuoteRecord } from '@/database/export/QuoteRecord';
import { QuoteDto } from '@/dto/QuoteDto';
import { LinkType } from '@/models/LinkType';
import { WebLinkCategory } from '@/models/WebLinkCategory';
import { QuoteType } from '@/models/quotes/QuoteType';

describe('toQuoteRecord', () => {
	const createQuote = (
		quote: Partial<QuoteDto> = {},
	): QuoteDto & { createdAt: Date; updatedAt: Date } =>
		({
			id: 1,
			quoteType: QuoteType.Tanka,
			text: 'やまとうた',
			plainText: 'やまとうた\n',
			transcription: 'やまとうた',
			locale: 'ojp',
			artist: { id: 2 },
			sourceUrl: '',
			hashtagLinks: [],
			webLinks: [],
			workLinks: [],
			createdAt: new Date('2022-06-04T10:57:08Z'),
			updatedAt: new Date('2022-06-05T10:57:08Z'),
			...quote,
		} as any);

	const webLink = (url: string, title = ''): any => ({
		id: 1,
		url,
		title,
		category: WebLinkCategory.Reference,
	});

	const workLink = (relatedWorkId: number): any => ({
		id: 1,
		linkType: LinkType.Quote_Work_Source,
		beginDate: { year: undefined, month: undefined, day: undefined },
		endDate: {},
		ended: false,
		relatedWork: { id: relatedWorkId },
	});

	test('references artists and works by ID', () => {
		const record = toQuoteRecord(
			createQuote({ workLinks: [workLink(3), workLink(4)] }),
		);

		expect(record).toEqual({
			id: 1,
			quoteType: QuoteType.Tanka,
			text: 'やまとうた',
			transcription: 'やまとうた',
			locale: 'ojp',
			artistId: 2,
			workIds: [3, 4],
			createdAt: 1654340228,
			updatedAt: 1654426628,
		});
	});

	test('shortens lapis links to the URL fragment', () => {
		const record = toQuoteRecord(
			createQuote({
				webLinks: [
					webLink(
						'https://lapis.nichibun.ac.jp/waka/waka_i001.html#i001-018-021',
					),
					webLink('https://example.com/'),
				],
			}),
		);

		expect(record.webLinks).toEqual([
			'i001-018-021',
			'https://example.com/',
		]);
	});

	test('rejects data that would be lost', () => {
		expect(() =>
			toQuoteRecord(
				createQuote({
					webLinks: [webLink('https://example.com/', 'Title')],
				}),
			),
		).toThrow('unsupported web link');

		expect(() =>
			toQuoteRecord(createQuote({ sourceUrl: 'https://example.com/' })),
		).toThrow('unsupported source URL');
	});
});
