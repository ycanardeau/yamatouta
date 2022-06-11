import { Translation } from '../../entities/Translation';
import { IContentEquatable } from '../IContentEquatable';
import { WordCategory } from '../translations/WordCategory';
import { HashtagSnapshot } from './HashtagSnapshot';
import { ISnapshotWithHashtags } from './ISnapshotWithHashtags';
import { ISnapshotWithWebLinks } from './ISnapshotWithWebLinks';
import { ISnapshotWithWorkLinks } from './ISnapshotWithWorkLinks';
import { WorkLinkSnapshot } from './LinkSnapshot';
import { WebLinkSnapshot } from './WebLinkSnapshot';

export type ITranslationSnapshot = Omit<TranslationSnapshot, 'contentEquals'>;

export class TranslationSnapshot
	implements
		IContentEquatable<ITranslationSnapshot>,
		ISnapshotWithWebLinks,
		ISnapshotWithWorkLinks,
		ISnapshotWithHashtags
{
	private constructor(
		readonly headword: string,
		readonly locale: string,
		readonly reading: string,
		readonly yamatokotoba: string,
		readonly category: WordCategory,
		readonly inishienomanabi_tags: string[],
		readonly webLinks: WebLinkSnapshot[],
		readonly workLinks: WorkLinkSnapshot[],
		readonly hashtags: HashtagSnapshot[],
	) {}

	static create(translation: Translation): TranslationSnapshot {
		const webLinks = translation.webLinks
			.getItems()
			.map((webLink) => WebLinkSnapshot.create(webLink));

		const workLinks = translation.workLinks
			.getItems()
			.map((workLink) => WorkLinkSnapshot.create(workLink));

		const hashtags = translation.hashtagLinks
			.getItems()
			.map((hashtagLink) =>
				HashtagSnapshot.create(hashtagLink.relatedHashtag.getEntity()),
			);

		return new TranslationSnapshot(
			translation.headword,
			translation.locale,
			translation.reading,
			translation.yamatokotoba,
			translation.category,
			translation.inishienomanabi_tags,
			webLinks,
			workLinks,
			hashtags,
		);
	}

	contentEquals(other?: ITranslationSnapshot): boolean {
		return JSON.stringify(this) === JSON.stringify(other);
	}
}
