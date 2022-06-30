import { HashtagLink } from '../../entities/HashtagLink';

export class HashtagLinkSnapshot {
	private constructor(readonly name: string) {}

	static create(hashtagLink: HashtagLink): HashtagLinkSnapshot {
		return new HashtagLinkSnapshot(hashtagLink.name);
	}
}
