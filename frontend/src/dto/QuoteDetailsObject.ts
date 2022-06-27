import { EntryType } from '../models/EntryType';
import { LinkType } from '../models/LinkType';
import { QuoteType } from '../models/quotes/QuoteType';
import { IArtistObject } from './IArtistObject';
import { IWorkLinkObject } from './ILinkObject';
import { IQuoteObject } from './IQuoteObject';
import { IWebLinkObject } from './IWebLinkObject';

export class QuoteDetailsObject {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType.Quote,
		readonly createdAt: string,
		readonly text: string,
		readonly plainText: string,
		readonly quoteType: QuoteType,
		readonly locale: string,
		readonly artist: IArtistObject,
		readonly sourceUrl: string,
		readonly webLinks: IWebLinkObject[],
		readonly sources: IWorkLinkObject[],
	) {}

	static create(quote: Required<IQuoteObject>): QuoteDetailsObject {
		return new QuoteDetailsObject(
			quote.id,
			quote.entryType,
			quote.createdAt,
			quote.text,
			quote.plainText,
			quote.quoteType,
			quote.locale,
			quote.artist,
			quote.sourceUrl,
			quote.webLinks,
			quote.workLinks.filter(
				(workLink) => workLink.linkType === LinkType.Quote_Work_Source,
			),
		);
	}
}
