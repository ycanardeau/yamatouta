import { Test, TestingModule } from '@nestjs/testing';

import { ListArtistsService } from './list-artists.service';

describe('ListArtistsService', () => {
	let service: ListArtistsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ListArtistsService],
		}).compile();

		service = module.get<ListArtistsService>(ListArtistsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
