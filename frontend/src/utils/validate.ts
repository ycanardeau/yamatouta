import { ArtistSearchRouteParams } from '@/models/artists/ArtistSearchRouteParams';
import { HashtagSearchRouteParams } from '@/models/hashtags/HashtagSearchRouteParams';
import { QuoteSearchRouteParams } from '@/models/quotes/QuoteSearchRouteParams';
import { TranslationSearchRouteParams } from '@/models/translations/TranslationSearchRouteParams';
import { UserSearchRouteParams } from '@/models/users/UserSearchRouteParams';
import { WorkSearchRouteParams } from '@/models/works/WorkSearchRouteParams';
import * as fns from '@/utils/validate-fns';
import { ValidateFunction } from 'ajv';

export const artistSearchRouteParams =
	fns.ArtistSearchRouteParams as ValidateFunction<ArtistSearchRouteParams>;
export const hashtagSearchRouteParams =
	fns.HashtagSearchRouteParams as ValidateFunction<HashtagSearchRouteParams>;
export const quoteSearchRouteParams =
	fns.QuoteSearchRouteParams as ValidateFunction<QuoteSearchRouteParams>;
export const translationSearchRouteParams =
	fns.TranslationSearchRouteParams as ValidateFunction<TranslationSearchRouteParams>;
export const userSearchRouteParams =
	fns.UserSearchRouteParams as ValidateFunction<UserSearchRouteParams>;
export const workSearchRouteParams =
	fns.WorkSearchRouteParams as ValidateFunction<WorkSearchRouteParams>;
