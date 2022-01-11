import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { createTranslation } from '../api/TranslationApi';
import { ITranslationObject } from '../dto/translations/ITranslationObject';
import { WordCategory } from '../models/WordCategory';

export class CreateTranslationDialogStore {
	@observable submitting = false;
	@observable headword = '';
	@observable locale = 'ja';
	@observable reading = '';
	@observable yamatokotoba = '';
	@observable category?: WordCategory;

	constructor() {
		makeObservable(this);
	}

	@computed get isJapanese(): boolean {
		return this.locale === 'ja';
	}

	@computed get isValid(): boolean {
		return (
			!!this.headword &&
			(!this.isJapanese || (this.isJapanese && !!this.reading)) &&
			!!this.yamatokotoba
		);
	}

	@action public setHeadword = (value: string): void => {
		this.headword = value;
	};

	@action public setLocale = (value: string): void => {
		this.locale = value;
	};

	@action public setReading = (value: string): void => {
		this.reading = value;
	};

	@action public setYamatokotoba = (value: string): void => {
		this.yamatokotoba = value;
	};

	@action public setCategory = (value?: WordCategory): void => {
		this.category = value;
	};

	@action submit = async (): Promise<ITranslationObject> => {
		try {
			this.submitting = true;

			// Await.
			const translation = await createTranslation({
				headword: this.headword,
				locale: this.locale,
				reading: this.reading,
				yamatokotoba: this.yamatokotoba,
				category: this.category,
			});

			return translation;
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
