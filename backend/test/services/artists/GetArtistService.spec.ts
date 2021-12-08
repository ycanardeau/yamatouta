import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../../src/app.module';
import { GetArtistService } from '../../../src/services/artists/GetArtistService';

describe('GetArtistService', () => {
	let service: GetArtistService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		service = module.get<GetArtistService>(GetArtistService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
