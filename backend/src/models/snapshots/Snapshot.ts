import { ArtistSnapshot } from './ArtistSnapshot';
import { QuoteSnapshot } from './QuoteSnapshot';
import { TranslationSnapshot } from './TranslationSnapshot';
import { WorkSnapshot } from './WorkSnapshot';

export type Snapshot =
	| TranslationSnapshot
	| ArtistSnapshot
	| QuoteSnapshot
	| WorkSnapshot;
