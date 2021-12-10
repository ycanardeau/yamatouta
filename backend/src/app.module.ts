import { Configuration } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import { ArtistController } from './controllers/ArtistController';
import { QuoteController } from './controllers/QuoteController';
import { UserController } from './controllers/UserController';
import { AuditLogService } from './services/AuditLogService';
import { GetArtistService } from './services/artists/GetArtistService';
import { ListArtistsService } from './services/artists/ListArtistsService';
import { GetQuoteService } from './services/quotes/GetQuoteService';
import { ListQuotesService } from './services/quotes/ListQuotesService';
import { GetUserService } from './services/users/GetUserService';
import { ListUsersService } from './services/users/ListUsersService';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.env.${process.env.NODE_ENV}`,
			validationSchema: Joi.object({
				PORT: Joi.number(),
				ALLOWED_CORS_ORIGINS: Joi.string(),
				DB_CONNECTION: Joi.string()
					.required()
					.valid(...Object.keys(Configuration.PLATFORMS)),
				DB_DATABASE: Joi.string().required(),
				DB_DEBUG: Joi.boolean().default(false),
				DB_USERNAME: Joi.string(),
				DB_PASSWORD: Joi.string(),
			}),
		}),
		MikroOrmModule.forRoot(),
	],
	controllers: [ArtistController, QuoteController, UserController],
	providers: [
		ListArtistsService,
		GetArtistService,
		ListQuotesService,
		GetQuoteService,
		ListUsersService,
		GetUserService,
		AuditLogService,
	],
})
export class AppModule {}
