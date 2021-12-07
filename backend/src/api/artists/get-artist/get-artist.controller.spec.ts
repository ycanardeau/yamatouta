import { Test, TestingModule } from '@nestjs/testing';

import { GetArtistController } from './get-artist.controller';

describe('GetArtistController', () => {
	let controller: GetArtistController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GetArtistController],
		}).compile();

		controller = module.get<GetArtistController>(GetArtistController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
