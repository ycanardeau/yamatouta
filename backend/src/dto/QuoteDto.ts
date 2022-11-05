import { ArtistDto } from '@/dto/ArtistDto';
import { HashtagLinkDto } from '@/dto/HashtagLinkDto';
import { WorkLinkDto } from '@/dto/LinkDto';
import { WebLinkDto } from '@/dto/WebLinkDto';
import { Quote } from '@/entities/Quote';
import { EntryType } from '@/models/EntryType';
import { QuoteOptionalField } from '@/models/quotes/QuoteOptionalField';
import { QuoteType } from '@/models/quotes/QuoteType';
import { PermissionContext } from '@/services/PermissionContext';

export class QuoteDto {
	_quoteDtoBrand: any;

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
		readonly artist: ArtistDto,
		readonly sourceUrl: string,
		readonly hashtagLinks?: HashtagLinkDto[],
		readonly webLinks?: WebLinkDto[],
		readonly workLinks?: WorkLinkDto[],
	) {}

	static create(
		permissionContext: PermissionContext,
		quote: Quote,
		fields: QuoteOptionalField[] = [],
	): QuoteDto {
		permissionContext.verifyDeletedAndHidden(quote);

		const hashtagLinks = fields.includes(QuoteOptionalField.HashtagLinks)
			? quote.hashtagLinks
					.getItems()
					.map((hashtagLink) =>
						HashtagLinkDto.create(permissionContext, hashtagLink),
					)
			: undefined;

		const webLinks = fields.includes(QuoteOptionalField.WebLinks)
			? quote.webLinks
					.getItems()
					.map((webLink) => WebLinkDto.create(webLink))
			: undefined;

		const workLinks = fields.includes(QuoteOptionalField.WorkLinks)
			? quote.workLinks
					.getItems()
					.map((workLink) =>
						WorkLinkDto.create(workLink, permissionContext),
					)
			: undefined;

		return new QuoteDto(
			quote.id,
			quote.entryType,
			quote.deleted,
			quote.hidden,
			quote.quoteType,
			quote.text,
			quote.plainText,
			quote.transcription,
			quote.locale,
			ArtistDto.create(permissionContext, quote.artist.getEntity()),
			quote.sourceUrl,
			hashtagLinks,
			webLinks,
			workLinks,
		);
	}
}
