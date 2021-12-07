import { Test, TestingModule } from '@nestjs/testing';

import { GetArtistService } from './get-artist.service';

describe('GetArtistService', () => {
	let service: GetArtistService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [GetArtistService],
		}).compile();

		service = module.get<GetArtistService>(GetArtistService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
