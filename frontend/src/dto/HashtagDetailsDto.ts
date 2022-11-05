import { IHashtagDto } from '@/dto/IHashtagDto';

export class HashtagDetailsDto {
	private constructor(
		readonly name: string,
		readonly referenceCount: number,
	) {}

	static create(hashtag: Required<IHashtagDto>): HashtagDetailsDto {
		return new HashtagDetailsDto(hashtag.name, hashtag.referenceCount);
	}
}
