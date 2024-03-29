import { IEntryWithIdAndName } from '@/models/IEntryWithIdAndName';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

// Code from: https://github.com/VocaDB/vocadb/blob/ac70db31ed594e3362e171d6fde9d5760f06dc62/VocaDbWeb/Scripts/ViewModels/BasicEntryLinkViewModel.ts.
export class BasicEntryLinkStore<TEntry extends IEntryWithIdAndName> {
	@observable private _entry?: TEntry;

	constructor(
		private readonly entryFunc?: (
			id: number,
		) => Promise<TEntry | undefined>,
	) {
		makeObservable(this);
	}

	@computed get entry(): TEntry | undefined {
		return this._entry;
	}

	@action loadEntryById = async (
		value: number | undefined,
	): Promise<void> => {
		if (!value) {
			this._entry = undefined;
			return;
		}

		const entry = await this.entryFunc?.(value);

		runInAction(() => {
			this._entry = entry;
		});
	};

	clear = (): Promise<void> => this.loadEntryById(undefined);
}
