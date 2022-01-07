import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { createTranslation } from '../api/TranslationApi';
import { ITranslationObject } from '../dto/translations/ITranslationObject';

export class CreateTranslationDialogStore {
	@observable submitting = false;
	@observable headword = '';
	@observable locale = 'ja';
	@observable reading = '';
	@observable yamatokotoba = '';

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

	@action submit = async (): Promise<ITranslationObject> => {
		try {
			this.submitting = true;

			return await createTranslation({
				headword: this.headword,
				locale: this.locale,
				reading: this.reading,
				yamatokotoba: this.yamatokotoba,
			});
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
