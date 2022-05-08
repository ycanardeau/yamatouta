import { Quote } from '../../entities/Quote';
import { QuoteOptionalField } from '../../models/QuoteOptionalField';
import { QuoteType } from '../../models/QuoteType';
import { PermissionContext } from '../../services/PermissionContext';
import { WebLinkObject } from '../WebLinkObject';
import { ArtistObject } from '../artists/ArtistObject';

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
	}
}
