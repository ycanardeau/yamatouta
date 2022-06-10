import { IdentifiedReference } from '@mikro-orm/core';

import { NgramConverter } from '../services/NgramConverter';
import { EntrySearchIndex } from './Entry';

export interface IEntryWithSearchIndex<TSearchIndex extends EntrySearchIndex> {
	searchIndex: IdentifiedReference<TSearchIndex>;
	updateSearchIndex(ngramConverter: NgramConverter): void;
}
