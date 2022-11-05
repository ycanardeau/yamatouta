import { EntrySearchIndex } from '@/models/Entry';
import { NgramConverter } from '@/services/NgramConverter';
import { IdentifiedReference } from '@mikro-orm/core';

export interface IEntryWithSearchIndex<TSearchIndex extends EntrySearchIndex> {
	searchIndex: IdentifiedReference<TSearchIndex>;
	updateSearchIndex(ngramConverter: NgramConverter): void;
}
