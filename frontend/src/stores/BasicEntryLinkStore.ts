import { computed, makeObservable, observable, runInAction } from 'mobx';

import { IEntryWithIdAndName } from '../models/IEntryWithIdAndName';

// Code from: https://github.com/VocaDB/vocadb/blob/ac70db31ed594e3362e171d6fde9d5760f06dc62/VocaDbWeb/Scripts/ViewModels/BasicEntryLinkViewModel.ts.
export class BasicEntryLinkStore<TEntry extends IEntryWithIdAndName> {
	@observable private _id?: number;
	@observable public entry?: TEntry;

	constructor(
		private readonly entryFunc?: (
			entryId: number,
		) => Promise<TEntry | undefined>,
	) {
		makeObservable(this);
	}

	@computed get id(): number | undefined {
		return this._id;
	}

	@computed get name(): string | undefined {
		return this.entry?.name;
	}

	@computed get isEmpty(): boolean {
		return !this.entry;
	}

	loadEntryById = async (value: number | undefined): Promise<void> => {
		this._id = value;

		if (!value) {
			this.entry = undefined;
			return;
		}

		const entry = await this.entryFunc?.(value);

		runInAction(() => {
			this.entry = entry;
		});
	};

	clear = (): Promise<void> => this.loadEntryById(undefined);
}
