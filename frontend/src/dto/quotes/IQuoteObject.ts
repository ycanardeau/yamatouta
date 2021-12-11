export interface IAuthorObject {
	id: number;
	authorType: 'artist' | 'user';
	name: string;
	avatarUrl?: string;
}

export interface IQuoteObject {
	id: number;
	createdAt: Date;
	phrases: string[];
	author: IAuthorObject;
	sourceUrl?: string;
}
