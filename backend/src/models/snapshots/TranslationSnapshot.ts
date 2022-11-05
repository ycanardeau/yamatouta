import { Translation } from '@/entities/Translation';
import { IContentEquatable } from '@/models/IContentEquatable';
import { ISnapshotWithWebLinks } from '@/models/snapshots/ISnapshotWithWebLinks';
import { ISnapshotWithWorkLinks } from '@/models/snapshots/ISnapshotWithWorkLinks';
import { WorkLinkSnapshot } from '@/models/snapshots/LinkSnapshot';
import { WebLinkSnapshot } from '@/models/snapshots/WebLinkSnapshot';
import { WordCategory } from '@/models/translations/WordCategory';

export type ITranslationSnapshot = Omit<TranslationSnapshot, 'contentEquals'>;

export class TranslationSnapshot
	implements
		IContentEquatable<ITranslationSnapshot>,
		ISnapshotWithWebLinks,
		ISnapshotWithWorkLinks
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
	) {}

	static create(translation: Translation): TranslationSnapshot {
		const webLinks = translation.webLinks
			.getItems()
			.map((webLink) => WebLinkSnapshot.create(webLink));

		const workLinks = translation.workLinks
			.getItems()
			.map((workLink) => WorkLinkSnapshot.create(workLink));

		return new TranslationSnapshot(
			translation.headword,
			translation.locale,
			translation.reading,
			translation.yamatokotoba,
			translation.category,
			translation.inishienomanabi_tags,
			webLinks,
			workLinks,
		);
	}

	contentEquals(other?: ITranslationSnapshot): boolean {
		return JSON.stringify(this) === JSON.stringify(other);
	}
}
