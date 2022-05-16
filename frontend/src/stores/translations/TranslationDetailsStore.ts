import { action, makeObservable, observable } from 'mobx';

import { ITranslationObject } from '../../dto/ITranslationObject';

export class TranslationDetailsStore {
	@observable translation: ITranslationObject;

	constructor(translation: ITranslationObject) {
		makeObservable(this);

		this.translation = translation;
	}

	@action setTranslation = (value: ITranslationObject): void => {
		this.translation = value;
	};
}
