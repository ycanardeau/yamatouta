import { NgramConverter } from '../services/NgramConverter';
import { EntrySearchIndex } from './Entry';

export interface IEntryWithSearchIndex<TSearchIndex extends EntrySearchIndex> {
	searchIndex: TSearchIndex;
	updateSearchIndex(ngramConverter: NgramConverter): void;
}
