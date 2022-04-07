import { Quote } from '../../entities/Quote';
import { QuoteType } from '../../models/QuoteType';
import { PermissionContext } from '../../services/PermissionContext';
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

	constructor(quote: Quote, permissionContext: PermissionContext) {
		permissionContext.verifyDeletedAndHidden(quote);

		this.id = quote.id;
		this.deleted = quote.deleted;
		this.hidden = quote.hidden;
		this.quoteType = quote.quoteType;
		this.text = quote.text;
		this.locale = quote.locale;
		this.artist = new ArtistObject(quote.artist, permissionContext);
		this.sourceUrl = quote.sourceUrl;
	}
}
