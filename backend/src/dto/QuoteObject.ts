import { Quote } from '../entities/Quote';
import { EntryType } from '../models/EntryType';
import { QuoteOptionalField } from '../models/quotes/QuoteOptionalField';
import { QuoteType } from '../models/quotes/QuoteType';
import { PermissionContext } from '../services/PermissionContext';
import { ArtistObject } from './ArtistObject';
import { HashtagLinkObject } from './HashtagLinkObject';
import { WorkLinkObject } from './LinkObject';
import { WebLinkObject } from './WebLinkObject';

export class QuoteObject {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType.Quote,
		readonly deleted: boolean,
		readonly hidden: boolean,
		readonly quoteType: QuoteType,
		readonly text: string,
		readonly plainText: string,
		readonly locale: string,
		readonly artist: ArtistObject,
		readonly sourceUrl: string,
		readonly hashtagLinks?: HashtagLinkObject[],
		readonly webLinks?: WebLinkObject[],
		readonly workLinks?: WorkLinkObject[],
	) {}

	static create(
		quote: Quote,
		permissionContext: PermissionContext,
		fields: QuoteOptionalField[] = [],
	): QuoteObject {
		permissionContext.verifyDeletedAndHidden(quote);

		const hashtagLinks = fields.includes(QuoteOptionalField.HashtagLinks)
			? quote.hashtagLinks
					.getItems()
					.map((hashtagLink) =>
						HashtagLinkObject.create(
							hashtagLink,
							permissionContext,
						),
					)
			: undefined;

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
			quote.entryType,
			quote.deleted,
			quote.hidden,
			quote.quoteType,
			quote.text,
			quote.plainText,
			quote.locale,
			ArtistObject.create(quote.artist.getEntity(), permissionContext),
			quote.sourceUrl,
			hashtagLinks,
			webLinks,
			workLinks,
		);
	}
}
