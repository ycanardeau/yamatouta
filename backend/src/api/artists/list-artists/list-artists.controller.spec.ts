import { Test, TestingModule } from '@nestjs/testing';

import { ListArtistsController } from './list-artists.controller';

describe('ListArtistsController', () => {
	let controller: ListArtistsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ListArtistsController],
		}).compile();

		controller = module.get<ListArtistsController>(ListArtistsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
