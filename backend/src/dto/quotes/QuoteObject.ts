import { Quote } from '../../entities/Quote';
import { AuthorType } from '../../models/AuthorType';
import { IAuthor } from '../../models/IAuthor';
import { QuoteType } from '../../models/QuoteType';
import { PermissionContext } from '../../services/PermissionContext';

export class AuthorObject {
	readonly authorType: AuthorType;
	readonly id: number;
	readonly name: string;
	readonly avatarUrl?: string;

	constructor(author: IAuthor) {
		this.authorType = author.authorType;
		this.id = author.id;
		this.name = author.name;
		this.avatarUrl = undefined /* TODO: Implement. */;
	}
}

export class QuoteObject {
	readonly id: number;
	readonly deleted: boolean;
	readonly hidden: boolean;
	readonly quoteType: QuoteType;
	readonly phrases: string[];
	readonly locale?: string;
	readonly author: AuthorObject;
	readonly sourceUrl?: string;

	constructor(quote: Quote, permissionContext: PermissionContext) {
		permissionContext.verifyDeletedAndHidden(quote);

		this.id = quote.id;
		this.deleted = quote.deleted;
		this.hidden = quote.hidden;
		this.quoteType = quote.quoteType;
		this.phrases = quote.text.split('\n');
		this.locale = quote.locale;
		this.author = new AuthorObject(quote.author);
		this.sourceUrl = quote.sourceUrl;
	}
}
