import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ArtistController } from './controllers/ArtistController';
import { AuthController } from './controllers/AuthController';
import { QuoteController } from './controllers/QuoteController';
import { SitemapController } from './controllers/SitemapController';
import { TranslationController } from './controllers/TranslationController';
import { UserController } from './controllers/UserController';
import { Artist } from './entities/Artist';
import { Quote } from './entities/Quote';
import { Translation } from './entities/Translation';
import { User } from './entities/User';
import { NgramConverter } from './helpers/NgramConverter';
import { AuditLogService } from './services/AuditLogService';
import { GenerateSitemapService } from './services/GenerateSitemapService';
import { PermissionContext } from './services/PermissionContext';
import { GetArtistService } from './services/artists/GetArtistService';
import { ListArtistIdsService } from './services/artists/ListArtistIdsService';
import { ListArtistsService } from './services/artists/ListArtistsService';
import { LocalSerializer } from './services/auth/LocalSerializer';
import { LocalStrategy } from './services/auth/LocalStrategy';
import { LoginService } from './services/auth/LoginService';
import { LogoutService } from './services/auth/LogoutService';
import { PasswordHasherFactory } from './services/passwordHashers/PasswordHasherFactory';
import { GetQuoteService } from './services/quotes/GetQuoteService';
import { ListQuoteIdsService } from './services/quotes/ListQuoteIdsService';
import { ListQuotesService } from './services/quotes/ListQuotesService';
import { ListTranslationsService } from './services/translations/ListTranslationsService';
import { AuthenticateUserService } from './services/users/AuthenticateUserService';
import { CreateUserService } from './services/users/CreateUserService';
import { GetUserService } from './services/users/GetUserService';
import { ListUsersService } from './services/users/ListUsersService';
import { NormalizeEmailService } from './services/users/NormalizeEmailService';
import { UpdatePasswordService } from './services/users/UpdatePasswordService';

@Module({
	imports: [
		MikroOrmModule.forRoot(),
		MikroOrmModule.forFeature([Artist, Quote, Translation, User]),
		PassportModule,
	],
	controllers: [
		ArtistController,
		QuoteController,
		UserController,
		AuthController,
		SitemapController,
		TranslationController,
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
		PasswordHasherFactory,
		UpdatePasswordService,
		ListArtistIdsService,
		ListQuoteIdsService,
		GenerateSitemapService,
		PermissionContext,
		//CreateTranslationService,
		ListTranslationsService,
		NgramConverter,
	],
})
export class AppModule {}
