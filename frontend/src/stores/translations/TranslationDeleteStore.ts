import { translationApi } from '@/api/translationApi';
import { ITranslationDto } from '@/dto/ITranslationDto';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

export class TranslationDeleteStore {
	@observable submitting = false;

	constructor(private readonly translation: ITranslationDto) {
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
