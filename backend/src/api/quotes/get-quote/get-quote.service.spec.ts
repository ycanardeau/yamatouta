import { Test, TestingModule } from '@nestjs/testing';

import { GetQuoteService } from './get-quote.service';

describe('GetQuoteService', () => {
	let service: GetQuoteService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [GetQuoteService],
		}).compile();

		service = module.get<GetQuoteService>(GetQuoteService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
