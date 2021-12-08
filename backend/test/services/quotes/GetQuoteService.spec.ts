import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../../src/app.module';
import { GetQuoteService } from '../../../src/services/quotes/GetQuoteService';

describe('GetQuoteService', () => {
	let service: GetQuoteService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		service = module.get<GetQuoteService>(GetQuoteService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
