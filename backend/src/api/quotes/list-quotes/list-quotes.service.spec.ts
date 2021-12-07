import { Test, TestingModule } from '@nestjs/testing';

import { ListQuotesService } from './list-quotes.service';

describe('ListQuotesService', () => {
	let service: ListQuotesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ListQuotesService],
		}).compile();

		service = module.get<ListQuotesService>(ListQuotesService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
