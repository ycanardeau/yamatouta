import { Artist } from '@/entities/Artist';
import { Quote } from '@/entities/Quote';
import { IContentEquatable } from '@/models/IContentEquatable';
import { QuoteType } from '@/models/quotes/QuoteType';
import { HashtagLinkSnapshot } from '@/models/snapshots/HashtagLinkSnapshot';
import { ISnapshotWithHashtagLinks } from '@/models/snapshots/ISnapshotWithHashtagLinks';
import { ISnapshotWithWebLinks } from '@/models/snapshots/ISnapshotWithWebLinks';
import { ISnapshotWithWorkLinks } from '@/models/snapshots/ISnapshotWithWorkLinks';
import { WorkLinkSnapshot } from '@/models/snapshots/LinkSnapshot';
import { ObjectRefSnapshot } from '@/models/snapshots/ObjectRefSnapshot';
import { WebLinkSnapshot } from '@/models/snapshots/WebLinkSnapshot';

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
