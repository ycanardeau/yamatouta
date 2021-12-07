import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { ArtistsModule } from './api/artists/artists.module';
import { QuotesModule } from './api/quotes/quotes.module';

@Module({
	imports: [MikroOrmModule.forRoot(), ArtistsModule, QuotesModule],
})
export class AppModule {}
