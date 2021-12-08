import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../../src/app.module';
import { ListQuotesService } from '../../../src/services/quotes/ListQuotesService';

describe('ListQuotesService', () => {
	let service: ListQuotesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		service = module.get<ListQuotesService>(ListQuotesService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
