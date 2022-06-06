import { ValidateFunction } from 'ajv';

import { IArtistSearchRouteParams } from '../models/artists/IArtistSearchRouteParams';
import { IQuoteSearchRouteParams } from '../models/quotes/IQuoteSearchRouteParams';
import { ITranslationSearchRouteParams } from '../models/translations/ITranslationSearchRouteParams';
import { IUserSearchRouteParams } from '../models/users/IUserSearchRouteParams';
import { IWorkSearchRouteParams } from '../models/works/IWorkSearchRouteParams';
import * as fns from './validate-fns';

export const artistSearchRouteParams =
	fns.IArtistSearchRouteParams as ValidateFunction<IArtistSearchRouteParams>;
export const quoteSearchRouteParams =
	fns.IQuoteSearchRouteParams as ValidateFunction<IQuoteSearchRouteParams>;
export const translationSearchRouteParams =
	fns.ITranslationSearchRouteParams as ValidateFunction<ITranslationSearchRouteParams>;
export const userSearchRouteParams =
	fns.IUserSearchRouteParams as ValidateFunction<IUserSearchRouteParams>;
export const workSearchRouteParams =
	fns.IWorkSearchRouteParams as ValidateFunction<IWorkSearchRouteParams>;
