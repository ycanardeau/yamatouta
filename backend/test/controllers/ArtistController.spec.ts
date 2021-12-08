import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { ArtistController } from '../../src/controllers/ArtistController';

describe('ArtistController', () => {
	let controller: ArtistController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		controller = module.get<ArtistController>(ArtistController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
