import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

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

	@action submit = async (): Promise<any /* TODO */> => {
		try {
			this.submitting = true;

			// TODO
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
