import { Quote } from '../entities/Quote';
import { QuoteOptionalField } from '../models/quotes/QuoteOptionalField';
import { QuoteType } from '../models/quotes/QuoteType';
import { PermissionContext } from '../services/PermissionContext';
import { ArtistObject } from './ArtistObject';
import { WorkLinkObject } from './LinkObject';
import { WebLinkObject } from './WebLinkObject';

export class QuoteObject {
	private constructor(
		readonly id: number,
		readonly deleted: boolean,
		readonly hidden: boolean,
		readonly quoteType: QuoteType,
		readonly text: string,
		readonly locale: string,
		readonly artist: ArtistObject,
		readonly sourceUrl: string,
		readonly webLinks?: WebLinkObject[],
		readonly workLinks?: WorkLinkObject[],
	) {}

	static create(
		quote: Quote,
		permissionContext: PermissionContext,
		fields: QuoteOptionalField[] = [],
	): QuoteObject {
		permissionContext.verifyDeletedAndHidden(quote);

		const webLinks = fields.includes(QuoteOptionalField.WebLinks)
			? quote.webLinks
					.getItems()
					.map((webLink) => WebLinkObject.create(webLink))
			: undefined;

		const workLinks = fields.includes(QuoteOptionalField.WorkLinks)
			? quote.workLinks
					.getItems()
					.map((workLink) =>
						WorkLinkObject.create(workLink, permissionContext),
					)
			: undefined;

		return new QuoteObject(
			quote.id,
			quote.deleted,
			quote.hidden,
			quote.quoteType,
			quote.text,
			quote.locale,
			ArtistObject.create(quote.artist, permissionContext),
			quote.sourceUrl,
			webLinks,
			workLinks,
		);
	}
}
