import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../../src/app.module';
import { ListArtistsService } from '../../../src/services/artists/ListArtistsService';

describe('ListArtistsService', () => {
	let service: ListArtistsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		service = module.get<ListArtistsService>(ListArtistsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
