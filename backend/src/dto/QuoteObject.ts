import { Quote } from '../entities/Quote';
import { QuoteOptionalField } from '../models/quotes/QuoteOptionalField';
import { QuoteType } from '../models/quotes/QuoteType';
import { PermissionContext } from '../services/PermissionContext';
import { ArtistObject } from './ArtistObject';
import { WorkLinkObject } from './LinkObject';
import { WebLinkObject } from './WebLinkObject';

export class QuoteObject {
	readonly id: number;
	readonly deleted: boolean;
	readonly hidden: boolean;
	readonly quoteType: QuoteType;
	readonly text: string;
	readonly locale: string;
	readonly artist: ArtistObject;
	readonly sourceUrl: string;
	readonly webLinks?: WebLinkObject[];
	readonly workLinks?: WorkLinkObject[];

	constructor(
		quote: Quote,
		permissionContext: PermissionContext,
		fields: QuoteOptionalField[] = [],
	) {
		permissionContext.verifyDeletedAndHidden(quote);

		this.id = quote.id;
		this.deleted = quote.deleted;
		this.hidden = quote.hidden;
		this.quoteType = quote.quoteType;
		this.text = quote.text;
		this.locale = quote.locale;
		this.artist = new ArtistObject(quote.artist, permissionContext);
		this.sourceUrl = quote.sourceUrl;
		this.webLinks = fields.includes(QuoteOptionalField.WebLinks)
			? quote.webLinks
					.getItems()
					.map((webLink) => new WebLinkObject(webLink))
			: undefined;
		this.workLinks = fields.includes(QuoteOptionalField.WorkLinks)
			? quote.workLinks
					.getItems()
					.map(
						(workLink) =>
							new WorkLinkObject(workLink, permissionContext),
					)
			: undefined;
	}
}
