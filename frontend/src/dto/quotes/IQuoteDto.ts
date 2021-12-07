export interface IAuthorDto {
	id: number;
	authorType: 'artist' | 'user';
	name: string;
	avatarUrl?: string;
}

export interface IQuoteDto {
	id: number;
	createdAt: Date;
	phrases: string[];
	author: IAuthorDto;
	sourceUrl?: string;
}
