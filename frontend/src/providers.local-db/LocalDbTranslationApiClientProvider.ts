import { IRevisionDto } from '@/dto/IRevisionDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { ITranslationDto } from '@/dto/ITranslationDto';
import { EntryType } from '@/models/EntryType';
import { ITranslationUpdateParams } from '@/models/translations/ITranslationUpdateParams';
import { TranslationOptionalField } from '@/models/translations/TranslationOptionalField';
import { TranslationSortRule } from '@/models/translations/TranslationSortRule';
import { WordCategory } from '@/models/translations/WordCategory';
import { ITranslationApiClientProvider } from '@/providers.abstractions/ITranslationApiClientProvider';
import { IPaginationParams } from '@/stores/PaginationStore';

export class LocalDbTranslationApiClientProvider
	implements ITranslationApiClientProvider
{
	async create({
		headword,
		locale,
		reading,
		yamatokotoba,
		category,
		webLinks,
		workLinks,
	}: ITranslationUpdateParams): Promise<ITranslationDto> {
		throw new Error('Method not implemented.');
	}

	async get({
		id,
		fields,
	}: {
		id: number;
		fields?: TranslationOptionalField[];
	}): Promise<ITranslationDto> {
		return {
			id: 0,
			entryType: EntryType.Translation,
			createdAt: new Date().toISOString(),
			headword: 'Headword 1',
			locale: 'ojp',
			reading: 'Reading 1',
			yamatokotoba: 'Yamatokotoba 1',
			category: WordCategory.Noun,
			webLinks: [],
			workLinks: [],
		};
	}

	async delete({ id }: { id: number }): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async list({
		pagination,
		sort,
		query,
		category,
	}: {
		pagination: IPaginationParams;
		sort?: TranslationSortRule;
		query?: string;
		category?: WordCategory;
	}): Promise<ISearchResultDto<ITranslationDto>> {
		return {
			items: [
				{
					id: 0,
					entryType: EntryType.Translation,
					createdAt: new Date().toISOString(),
					headword: 'Headword 1',
					locale: 'ojp',
					reading: 'Reading 1',
					yamatokotoba: 'Yamatokotoba 1',
					category: WordCategory.Noun,
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
		headword,
		locale,
		reading,
		yamatokotoba,
		category,
		webLinks,
		workLinks,
	}: ITranslationUpdateParams): Promise<ITranslationDto> {
		throw new Error('Method not implemented.');
	}
}
