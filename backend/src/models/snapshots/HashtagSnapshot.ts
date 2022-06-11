import { Hashtag } from '../../entities/Hashtag';

export class HashtagSnapshot {
	private constructor(readonly name: string) {}

	static create(hashtag: Hashtag): HashtagSnapshot {
		return new HashtagSnapshot(hashtag.name);
	}
}
