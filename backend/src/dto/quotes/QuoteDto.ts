import { AuthorType, IAuthor, Quote, QuoteType } from '../../entities/Quote';

export class AuthorDto {
	readonly authorType: AuthorType;
	readonly id: number;
	readonly name: string;
	readonly avatarUrl?: string;

	constructor(author: IAuthor) {
		this.authorType = author.authorType;
		this.id = author.id;
		this.name = author.name;
		this.avatarUrl = undefined /* TODO: Implement. */;
	}
}

export class QuoteDto {
	readonly id: number;
	readonly quoteType: QuoteType;
	readonly phrases: string[];
	readonly locale?: string;
	readonly author: AuthorDto;
	readonly sourceUrl?: string;

	constructor(quote: Quote) {
		if (quote.deleted || quote.hidden)
			throw new Error(`Quote ${quote.id} has already been deleted.`);

		this.id = quote.id;
		this.quoteType = quote.quoteType;
		this.phrases = quote.text.split('\n');
		this.locale = quote.locale;
		this.author = new AuthorDto(quote.author);
		this.sourceUrl = quote.sourceUrl;
	}
}
