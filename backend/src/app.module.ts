import { Configuration } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import Joi from 'joi';

import { ArtistController } from './controllers/ArtistController';
import { AuthController } from './controllers/AuthController';
import { QuoteController } from './controllers/QuoteController';
import { UserController } from './controllers/UserController';
import { AuditLogService } from './services/AuditLogService';
import { GetArtistService } from './services/artists/GetArtistService';
import { ListArtistsService } from './services/artists/ListArtistsService';
import { LocalSerializer } from './services/auth/LocalSerializer';
import { LocalStrategy } from './services/auth/LocalStrategy';
import { LoginService } from './services/auth/LoginService';
import { LogoutService } from './services/auth/LogoutService';
import { GetQuoteService } from './services/quotes/GetQuoteService';
import { ListQuotesService } from './services/quotes/ListQuotesService';
import { AuthenticateUserService } from './services/users/AuthenticateUserService';
import { CreateUserService } from './services/users/CreateUserService';
import { GetUserService } from './services/users/GetUserService';
import { ListUsersService } from './services/users/ListUsersService';
import { NormalizeEmailService } from './services/users/NormalizeEmailService';

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
				SESSION_SECRET: Joi.string().required(),
			}),
		}),
		MikroOrmModule.forRoot(),
		PassportModule,
	],
	controllers: [
		ArtistController,
		QuoteController,
		UserController,
		AuthController,
	],
	providers: [
		ListArtistsService,
		GetArtistService,
		ListQuotesService,
		GetQuoteService,
		ListUsersService,
		GetUserService,
		AuditLogService,
		CreateUserService,
		AuthenticateUserService,
		LocalStrategy,
		LocalSerializer,
		LoginService,
		LogoutService,
		NormalizeEmailService,
	],
})
export class AppModule {}
