import { LinkType } from '../models/LinkType';
import { QuoteType } from '../models/quotes/QuoteType';
import { IArtistObject } from './IArtistObject';
import { IWorkLinkObject } from './ILinkObject';
import { IQuoteObject } from './IQuoteObject';
import { IWebLinkObject } from './IWebLinkObject';

export class QuoteDetailsObject {
	private constructor(
		readonly id: number,
		readonly createdAt: string,
		readonly text: string,
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
			quote.createdAt,
			quote.text,
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
