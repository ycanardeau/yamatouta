import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { translationApi } from '../../api/translationApi';
import { ITranslationObject } from '../../dto/ITranslationObject';
import { WordCategory } from '../../models/translations/WordCategory';
import { WebLinkListEditStore } from '../WebLinkListEditStore';

export class TranslationEditStore {
	@observable submitting = false;
	@observable headword = '';
	@observable locale = 'ja';
	@observable reading = '';
	@observable yamatokotoba = '';
	@observable category = WordCategory.Unspecified;
	readonly webLinks: WebLinkListEditStore;

	constructor(private readonly translation?: ITranslationObject) {
		makeObservable(this);

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

			const createOrUpdate = this.translation
				? translationApi.update
				: translationApi.create;

			// Await.
			const translation = await createOrUpdate({
				id: this.translation?.id ?? 0,
				headword: this.headword,
				locale: this.locale,
				reading: this.reading,
				yamatokotoba: this.yamatokotoba,
				category: this.category,
				webLinks: this.webLinks.items,
			});

			return translation;
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
