import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { deleteTranslation } from '../../api/TranslationApi';
import { ITranslationObject } from '../../dto/ITranslationObject';

export class TranslationDeleteStore {
	private readonly translation: ITranslationObject;
	@observable submitting = false;

	constructor({ translation }: { translation: ITranslationObject }) {
		makeObservable(this);

		this.translation = translation;
	}

	@computed get isValid(): boolean {
		return true;
	}

	@action submit = async (): Promise<void> => {
		try {
			this.submitting = true;

			await deleteTranslation({ translationId: this.translation.id });
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
