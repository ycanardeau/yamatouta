import { Test, TestingModule } from '@nestjs/testing';

import { ListQuotesController } from './list-quotes.controller';

describe('ListQuotesController', () => {
	let controller: ListQuotesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ListQuotesController],
		}).compile();

		controller = module.get<ListQuotesController>(ListQuotesController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
