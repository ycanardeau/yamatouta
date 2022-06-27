import { IHashtagObject } from './IHashtagObject';

export class HashtagDetailsObject {
	private constructor(readonly name: string) {}

	static create(hashtag: Required<IHashtagObject>): HashtagDetailsObject {
		return new HashtagDetailsObject(hashtag.name);
	}
}
