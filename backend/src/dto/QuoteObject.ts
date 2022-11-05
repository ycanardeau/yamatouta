import { ArtistObject } from '@/dto/ArtistObject';
import { HashtagLinkObject } from '@/dto/HashtagLinkObject';
import { WorkLinkObject } from '@/dto/LinkObject';
import { WebLinkObject } from '@/dto/WebLinkObject';
import { Quote } from '@/entities/Quote';
import { EntryType } from '@/models/EntryType';
import { QuoteOptionalField } from '@/models/quotes/QuoteOptionalField';
import { QuoteType } from '@/models/quotes/QuoteType';
import { PermissionContext } from '@/services/PermissionContext';

export class QuoteObject {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType.Quote,
		readonly deleted: boolean,
		readonly hidden: boolean,
		readonly quoteType: QuoteType,
		readonly text: string,
		readonly plainText: string,
		readonly transcription: string,
		readonly locale: string,
		readonly artist: ArtistObject,
		readonly sourceUrl: string,
		readonly hashtagLinks?: HashtagLinkObject[],
		readonly webLinks?: WebLinkObject[],
		readonly workLinks?: WorkLinkObject[],
	) {}

	static create(
		permissionContext: PermissionContext,
		quote: Quote,
		fields: QuoteOptionalField[] = [],
	): QuoteObject {
		permissionContext.verifyDeletedAndHidden(quote);

		const hashtagLinks = fields.includes(QuoteOptionalField.HashtagLinks)
			? quote.hashtagLinks
					.getItems()
					.map((hashtagLink) =>
						HashtagLinkObject.create(
							permissionContext,
							hashtagLink,
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
			quote.transcription,
			quote.locale,
			ArtistObject.create(permissionContext, quote.artist.getEntity()),
			quote.sourceUrl,
			hashtagLinks,
			webLinks,
			workLinks,
		);
	}
}
