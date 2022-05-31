import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';

import { controllers } from './controllers/controllers';
import { commandHandlers } from './database/commands/commandHandlers';
import { queryHandlers } from './database/queries/queryHandlers';
import { Artist } from './entities/Artist';
import { Quote } from './entities/Quote';
import { TranslationRevision } from './entities/Revision';
import { Translation } from './entities/Translation';
import { User } from './entities/User';
import { Work } from './entities/Work';
import { services } from './services/services';

@Module({
	imports: [
		MikroOrmModule.forRoot(),
		MikroOrmModule.forFeature([
			Artist,
			Quote,
			Translation,
			TranslationRevision,
			User,
			Work,
		]),
		PassportModule,
		CqrsModule,
	],
	controllers: controllers,
	providers: [...queryHandlers, ...commandHandlers, ...services],
})
export class AppModule {}
