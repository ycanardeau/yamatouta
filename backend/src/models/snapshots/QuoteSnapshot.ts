import { Artist } from '../../entities/Artist';
import { Quote } from '../../entities/Quote';
import { IContentEquatable } from '../IContentEquatable';
import { QuoteType } from '../quotes/QuoteType';
import { HashtagLinkSnapshot } from './HashtagLinkSnapshot';
import { ISnapshotWithHashtagLinks } from './ISnapshotWithHashtagLinks';
import { ISnapshotWithWebLinks } from './ISnapshotWithWebLinks';
import { ISnapshotWithWorkLinks } from './ISnapshotWithWorkLinks';
import { WorkLinkSnapshot } from './LinkSnapshot';
import { ObjectRefSnapshot } from './ObjectRefSnapshot';
import { WebLinkSnapshot } from './WebLinkSnapshot';

export type IQuoteSnapshot = Omit<QuoteSnapshot, 'contentEquals'>;

export class QuoteSnapshot
	implements
		IContentEquatable<IQuoteSnapshot>,
		ISnapshotWithWebLinks,
		ISnapshotWithWorkLinks,
		ISnapshotWithHashtagLinks
{
	private constructor(
		readonly text: string,
		readonly quoteType: QuoteType,
		readonly locale: string,
		readonly artist: ObjectRefSnapshot<Artist>,
		readonly webLinks: WebLinkSnapshot[],
		readonly workLinks: WorkLinkSnapshot[],
		readonly transcription: string,
		readonly foreword: string,
		readonly customArtistName: string,
		readonly hashtagLinks: HashtagLinkSnapshot[],
	) {}

	static create(quote: Quote): QuoteSnapshot {
		const webLinks = quote.webLinks
			.getItems()
			.map((webLink) => WebLinkSnapshot.create(webLink));

		const workLinks = quote.workLinks
			.getItems()
			.map((workLink) => WorkLinkSnapshot.create(workLink));

		const hashtagLinks = quote.hashtagLinks
			.getItems()
			.map((hashtagLink) => HashtagLinkSnapshot.create(hashtagLink));

		return new QuoteSnapshot(
			quote.text,
			quote.quoteType,
			quote.locale,
			ObjectRefSnapshot.create<Artist>(quote.artist.getEntity()),
			webLinks,
			workLinks,
			quote.transcription,
			quote.foreword,
			quote.customArtistName,
			hashtagLinks,
		);
	}

	contentEquals(other?: IQuoteSnapshot): boolean {
		return JSON.stringify(this) === JSON.stringify(other);
	}
}
