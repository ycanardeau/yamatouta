import { translationApi } from '@/api/translationApi';
import { ITranslationObject } from '@/dto/ITranslationObject';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

export class TranslationDeleteStore {
	@observable submitting = false;

	constructor(private readonly translation: ITranslationObject) {
		makeObservable(this);
	}

	@computed get isValid(): boolean {
		return true;
	}

	@action submit = async (): Promise<void> => {
		try {
			this.submitting = true;

			await translationApi.delete({ id: this.translation.id });
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
