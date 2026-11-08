import { QuoteDto } from '@/dto/QuoteDto';
import { LinkType } from '@/models/LinkType';
import { WebLinkCategory } from '@/models/WebLinkCategory';
import { QuoteType } from '@/models/quotes/QuoteType';

// Compact form of a quote in the quotes.<n>.json files. Artists and works are
// referenced by ID (see artists.json and works.json), and fields that are the
// same for every quote are left out. Keep in sync with IQuoteRecord in
// frontend/src/api/json/jsonDatabase.ts.
export interface IQuoteRecord {
	id: number;
	quoteType: QuoteType;
	text: string;
	transcription: string;
	locale: string;
	artistId: number;
	// Works linked as `Quote_Work_Source`.
	workIds?: number[];
	// URLs of `Reference` web links. Links to waka on lapis.nichibun.ac.jp are
	// shortened to the URL fragment, e.g. `i001-001-001`.
	webLinks?: string[];
	// Seconds since the Unix epoch.
	createdAt: number;
	updatedAt: number;
}

const lapisUrlPattern =
	/^https:\/\/lapis\.nichibun\.ac\.jp\/waka\/waka_(i\d+)\.html#(\1-[\w-]+)$/;

// Partial dates have their fields set to undefined when empty.
const isEmptyDate = (date: object): boolean =>
	Object.values(date).every((value) => value === undefined);

const toUnixTime = (date: Date): number => Math.floor(date.getTime() / 1000);

// Throws if the quote has data that the compact form cannot represent, so
// nothing is dropped silently.
export const toQuoteRecord = (
	quote: QuoteDto & { createdAt: Date; updatedAt: Date },
): IQuoteRecord => {
	const unsupported = (field: string): Error =>
		new Error(`Quote ${quote.id} has an unsupported ${field}.`);

	if (quote.sourceUrl) throw unsupported('source URL');

	if (quote.plainText.trimEnd() !== quote.text.trimEnd())
		throw unsupported('formatted text');

	if (quote.hashtagLinks?.length) throw unsupported('hashtag link');

	const workIds = (quote.workLinks ?? []).map((link) => {
		if (
			link.linkType !== LinkType.Quote_Work_Source ||
			!isEmptyDate(link.beginDate) ||
			!isEmptyDate(link.endDate) ||
			link.ended
		)
			throw unsupported('work link');

		return link.relatedWork.id;
	});

	const webLinks = (quote.webLinks ?? []).map((link) => {
		if (link.title || link.category !== WebLinkCategory.Reference)
			throw unsupported('web link');

		return lapisUrlPattern.exec(link.url)?.[2] ?? link.url;
	});

	return {
		id: quote.id,
		quoteType: quote.quoteType,
		text: quote.text,
		transcription: quote.transcription,
		locale: quote.locale,
		artistId: quote.artist.id,
		...(workIds.length > 0 && { workIds }),
		...(webLinks.length > 0 && { webLinks }),
		createdAt: toUnixTime(quote.createdAt),
		updatedAt: toUnixTime(quote.updatedAt),
	};
};
