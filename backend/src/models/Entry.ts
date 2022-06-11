import { Artist, ArtistSearchIndex } from '../entities/Artist';
import { Quote, QuoteSearchIndex } from '../entities/Quote';
import { Translation, TranslationSearchIndex } from '../entities/Translation';
import { User, UserSearchIndex } from '../entities/User';
import { Work, WorkSearchIndex } from '../entities/Work';

export type Entry = Artist | Quote | Translation | User | Work;

export type EntryWithRevisions = Artist | Quote | Translation | Work;

export type EntrySearchIndex =
	| TranslationSearchIndex
	| ArtistSearchIndex
	| QuoteSearchIndex
	| UserSearchIndex
	| WorkSearchIndex;
