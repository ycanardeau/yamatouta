import { EntryType } from '@/models/EntryType';
import { IEntryWithEntryType } from '@/models/IEntryWithEntryType';

export class EntryUrlMapper {
	static details(entry: IEntryWithEntryType<EntryType>): string {
		switch (entry.entryType) {
			case EntryType.Artist:
				return `/artists/${entry.id}`;

			case EntryType.Quote:
				return `/quotes/${entry.id}`;

			case EntryType.Translation:
				return `/translations/${entry.id}`;

			case EntryType.User:
				return `/users/${entry.id}`;

			case EntryType.Work:
				return `/works/${entry.id}`;
		}
	}
}
