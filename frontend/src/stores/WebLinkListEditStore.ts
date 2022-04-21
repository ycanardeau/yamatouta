import { makeObservable, observable } from 'mobx';

import { IWebLinkObject } from '../dto/IWebLinkObject';
import { WebLinkCategory } from '../models/WebLinkCategory';
import { BasicListEditStore } from './BasicListEditStore';

export class WebLinkEditStore {
	@observable id?: number;
	@observable url = '';
	@observable category = WebLinkCategory.Other;

	constructor(webLink?: IWebLinkObject) {
		makeObservable(this);

		if (webLink) {
			this.id = webLink.id;
			this.url = webLink.url;
			this.category = webLink.category;
		}
	}
}

export class WebLinkListEditStore extends BasicListEditStore<
	WebLinkEditStore,
	IWebLinkObject
> {
	constructor(objects: IWebLinkObject[]) {
		super(WebLinkEditStore, objects);
	}
}
