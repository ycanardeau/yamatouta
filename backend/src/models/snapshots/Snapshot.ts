import { ArtistSnapshot } from '@/models/snapshots/ArtistSnapshot';
import { QuoteSnapshot } from '@/models/snapshots/QuoteSnapshot';
import { TranslationSnapshot } from '@/models/snapshots/TranslationSnapshot';
import { WorkSnapshot } from '@/models/snapshots/WorkSnapshot';

export type Snapshot =
	| TranslationSnapshot
	| ArtistSnapshot
	| QuoteSnapshot
	| WorkSnapshot;
