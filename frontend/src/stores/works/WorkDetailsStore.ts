import { action, makeObservable, observable } from 'mobx';

import { IWorkObject } from '../../dto/works/IWorkObject';

export class WorkDetailsStore {
	@observable work: IWorkObject;

	constructor(work: IWorkObject) {
		makeObservable(this);

		this.work = work;
	}

	@action setWork = (value: IWorkObject): void => {
		this.work = value;
	};
}
