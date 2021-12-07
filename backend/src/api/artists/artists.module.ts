import { Module } from '@nestjs/common';

import { GetArtistController } from './get-artist/get-artist.controller';
import { GetArtistService } from './get-artist/get-artist.service';
import { ListArtistsController } from './list-artists/list-artists.controller';
import { ListArtistsService } from './list-artists/list-artists.service';

@Module({
	providers: [ListArtistsService, GetArtistService],
	controllers: [ListArtistsController, GetArtistController],
})
export class ArtistsModule {}
