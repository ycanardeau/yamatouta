import { Artist, ArtistSearchIndex } from '../entities/Artist';
import { Quote, QuoteSearchIndex } from '../entities/Quote';
import { Translation, TranslationSearchIndex } from '../entities/Translation';
import { UserSearchIndex } from '../entities/User';
import { Work, WorkSearchIndex } from '../entities/Work';

export type Entry = Translation | Artist | Quote | Work;

export type EntrySearchIndex =
	| TranslationSearchIndex
	| ArtistSearchIndex
	| QuoteSearchIndex
	| UserSearchIndex
	| WorkSearchIndex;
