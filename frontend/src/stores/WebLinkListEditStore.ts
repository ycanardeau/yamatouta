import { action, makeObservable, observable } from 'mobx';

import { IWebLinkObject } from '../dto/IWebLinkObject';
import { WebLinkCategory } from '../models/WebLinkCategory';
import { BasicListEditStore } from './BasicListEditStore';

export class WebLinkEditStore {
	@observable id = 0;
	@observable url = '';
	@observable category = WebLinkCategory.Reference;

	constructor(webLink?: IWebLinkObject) {
		makeObservable(this);

		if (webLink) {
			this.id = webLink.id;
			this.url = webLink.url;
			this.category = webLink.category;
		}
	}

	@action setUrl = (value: string): void => {
		this.url = value;
	};

	@action setCategory = (value: WebLinkCategory): void => {
		this.category = value;
	};
}

export class WebLinkListEditStore extends BasicListEditStore<
	WebLinkEditStore,
	IWebLinkObject
> {
	constructor(objects: IWebLinkObject[]) {
		super(WebLinkEditStore, objects);
	}
}
