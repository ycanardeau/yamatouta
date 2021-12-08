import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { QuoteController } from '../../src/controllers/QuoteController';

describe('QuoteController', () => {
	let controller: QuoteController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		controller = module.get<QuoteController>(QuoteController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
