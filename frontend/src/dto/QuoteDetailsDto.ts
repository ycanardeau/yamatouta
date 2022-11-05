import { IArtistDto } from '@/dto/IArtistDto';
import { IWorkLinkDto } from '@/dto/ILinkDto';
import { IQuoteDto } from '@/dto/IQuoteDto';
import { IWebLinkDto } from '@/dto/IWebLinkDto';
import { EntryType } from '@/models/EntryType';
import { LinkType } from '@/models/LinkType';
import { QuoteType } from '@/models/quotes/QuoteType';

export class QuoteDetailsDto {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType.Quote,
		readonly createdAt: string,
		readonly text: string,
		readonly plainText: string,
		readonly transcription: string,
		readonly quoteType: QuoteType,
		readonly locale: string,
		readonly artist: IArtistDto,
		readonly sourceUrl: string,
		readonly webLinks: IWebLinkDto[],
		readonly sources: IWorkLinkDto[],
	) {}

	static create(quote: Required<IQuoteDto>): QuoteDetailsDto {
		return new QuoteDetailsDto(
			quote.id,
			quote.entryType,
			quote.createdAt,
			quote.text,
			quote.plainText,
			quote.transcription,
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
