import { action, makeObservable, observable } from 'mobx';

import { IWebLinkObject } from '../dto/IWebLinkObject';
import { IWebLinkUpdateParams } from '../models/IWebLinkUpdateParams';
import { WebLinkCategory } from '../models/WebLinkCategory';
import { BasicListEditStore } from './BasicListEditStore';

export class WebLinkEditStore {
	@observable id = 0;
	@observable url = '';
	@observable title = '';
	@observable category = WebLinkCategory.Reference;

	constructor(webLink?: IWebLinkObject) {
		makeObservable(this);

		if (webLink) {
			this.id = webLink.id;
			this.url = webLink.url;
			this.title = webLink.title;
			this.category = webLink.category;
		}
	}

	@action setUrl = (value: string): void => {
		this.url = value;
	};

	@action setTitle = (value: string): void => {
		this.title = value;
	};

	@action setCategory = (value: WebLinkCategory): void => {
		this.category = value;
	};

	toParams = (): IWebLinkUpdateParams => {
		return {
			id: this.id,
			url: this.url,
			title: this.title,
			category: this.category,
		};
	};
}

export class WebLinkListEditStore extends BasicListEditStore<
	WebLinkEditStore,
	IWebLinkObject
> {
	constructor(objects: IWebLinkObject[]) {
		super(WebLinkEditStore, objects);
	}

	toParams = (): IWebLinkUpdateParams[] => {
		return this.items.map((item) => item.toParams());
	};
}
