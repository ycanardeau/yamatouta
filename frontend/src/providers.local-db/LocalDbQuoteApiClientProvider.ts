import { IQuoteDto } from '@/dto/IQuoteDto';
import { IRevisionDto } from '@/dto/IRevisionDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { EntryType } from '@/models/EntryType';
import { ArtistType } from '@/models/artists/ArtistType';
import { IQuoteUpdateParams } from '@/models/quotes/IQuoteUpdateParams';
import { QuoteOptionalField } from '@/models/quotes/QuoteOptionalField';
import { QuoteSortRule } from '@/models/quotes/QuoteSortRule';
import { QuoteType } from '@/models/quotes/QuoteType';
import { IQuoteApiClientProvider } from '@/providers.abstractions/IQuoteApiClientProvider';
import { IPaginationParams } from '@/stores/PaginationStore';

export class LocalDbQuoteApiClientProvider implements IQuoteApiClientProvider {
	async create({
		text,
		quoteType,
		locale,
		artistId,
		webLinks,
		workLinks,
	}: IQuoteUpdateParams): Promise<IQuoteDto> {
		throw new Error('Method not implemented.');
	}

	async delete({ id }: { id: number }): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async get({
		id,
		fields,
	}: {
		id: number;
		fields?: QuoteOptionalField[];
	}): Promise<IQuoteDto> {
		return {
			id: 0,
			entryType: EntryType.Quote,
			createdAt: new Date().toISOString(),
			text: 'Text 1',
			plainText: 'Plain text 1',
			transcription: 'Transcription 1',
			quoteType: QuoteType.Word,
			locale: 'ojp',
			artist: {
				id: 0,
				name: 'Artist 1',
				entryType: EntryType.Artist,
				artistType: ArtistType.Person,
			},
			sourceUrl: '',
			hashtagLinks: [],
			webLinks: [],
			workLinks: [],
		};
	}

	async list({
		pagination,
		sort,
		query,
		quoteType,
		artistId,
		workId,
		hashtags,
	}: {
		pagination: IPaginationParams;
		sort?: QuoteSortRule;
		query?: string;
		quoteType?: QuoteType;
		artistId?: number;
		workId?: number;
		hashtags?: string[];
	}): Promise<ISearchResultDto<IQuoteDto>> {
		return {
			items: [
				{
					id: 0,
					entryType: EntryType.Quote,
					createdAt: new Date().toISOString(),
					text: 'Text 1',
					plainText: 'Plain text 1',
					transcription: 'Transcription 1',
					quoteType: QuoteType.Word,
					locale: 'ojp',
					artist: {
						id: 0,
						name: 'Artist 1',
						entryType: EntryType.Artist,
						artistType: ArtistType.Person,
					},
					sourceUrl: '',
					hashtagLinks: [],
					webLinks: [],
					workLinks: [],
				},
			],
			totalCount: 1,
		};
	}

	async listRevisions({
		id,
	}: {
		id: number;
	}): Promise<ISearchResultDto<IRevisionDto>> {
		return {
			items: [],
			totalCount: 0,
		};
	}

	async update({
		id,
		text,
		quoteType,
		locale,
		artistId,
		webLinks,
		workLinks,
	}: IQuoteUpdateParams): Promise<IQuoteDto> {
		throw new Error('Method not implemented.');
	}
}
