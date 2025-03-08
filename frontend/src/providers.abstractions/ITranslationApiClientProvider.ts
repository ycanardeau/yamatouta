import { IRevisionDto } from '@/dto/IRevisionDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { ITranslationDto } from '@/dto/ITranslationDto';
import { ITranslationUpdateParams } from '@/models/translations/ITranslationUpdateParams';
import { TranslationOptionalField } from '@/models/translations/TranslationOptionalField';
import { TranslationSortRule } from '@/models/translations/TranslationSortRule';
import { WordCategory } from '@/models/translations/WordCategory';
import { IPaginationParams } from '@/stores/PaginationStore';

export interface ITranslationApiClientProvider {
	create(request: ITranslationUpdateParams): Promise<ITranslationDto>;
	get(request: {
		id: number;
		fields?: TranslationOptionalField[];
	}): Promise<ITranslationDto>;
	delete(request: { id: number }): Promise<void>;
	list(request: {
		pagination: IPaginationParams;
		sort?: TranslationSortRule;
		query?: string;
		category?: WordCategory;
	}): Promise<ISearchResultDto<ITranslationDto>>;
	listRevisions(request: {
		id: number;
	}): Promise<ISearchResultDto<IRevisionDto>>;
	update(request: ITranslationUpdateParams): Promise<ITranslationDto>;
}
