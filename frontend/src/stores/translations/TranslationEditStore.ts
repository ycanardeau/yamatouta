import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { createTranslation, updateTranslation } from '../../api/TranslationApi';
import { ITranslationObject } from '../../dto/ITranslationObject';
import { WordCategory } from '../../models/WordCategory';
import { WebLinkListEditStore } from '../WebLinkListEditStore';

export class TranslationEditStore {
	private readonly translation?: ITranslationObject;
	@observable submitting = false;
	@observable headword = '';
	@observable locale = 'ja';
	@observable reading = '';
	@observable yamatokotoba = '';
	@observable category = WordCategory.Unspecified;
	readonly webLinks: WebLinkListEditStore;

	constructor(translation?: ITranslationObject) {
		makeObservable(this);

		this.translation = translation;

		if (translation) {
			this.headword = translation.headword;
			this.locale = translation.locale;
			this.reading = translation.reading;
			this.yamatokotoba = translation.yamatokotoba;
			this.category = translation.category;
			this.webLinks = new WebLinkListEditStore(translation.webLinks);
		} else {
			this.webLinks = new WebLinkListEditStore([]);
		}
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

	@action public setCategory = (value: WordCategory): void => {
		this.category = value;
	};

	@action submit = async (): Promise<ITranslationObject> => {
		try {
			this.submitting = true;

			const params = {
				headword: this.headword,
				locale: this.locale,
				reading: this.reading,
				yamatokotoba: this.yamatokotoba,
				category: this.category,
				webLinks: this.webLinks.items,
			};

			// Await.
			const translation = await (this.translation
				? updateTranslation({
						...params,
						translationId: this.translation.id,
				  })
				: createTranslation(params));

			return translation;
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
