import { QuoteDetailsDto } from '@/dto/QuoteDetailsDto';

export class QuoteDetailsStore {
	constructor(readonly quote: QuoteDetailsDto) {}
}
