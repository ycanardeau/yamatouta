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
import { TranslationRevision } from './entities/Revision';
import { Translation } from './entities/Translation';
import { User } from './entities/User';
import { NgramConverter } from './helpers/NgramConverter';
import { AuditLogService } from './services/AuditLogService';
import { GenerateSitemapService } from './services/GenerateSitemapService';
import { PermissionContext } from './services/PermissionContext';
import { CreateArtistService } from './services/artists/CreateArtistService';
import { GetArtistService } from './services/artists/GetArtistService';
import { ListArtistIdsService } from './services/artists/ListArtistIdsService';
import { ListArtistsService } from './services/artists/ListArtistsService';
import { LocalSerializer } from './services/auth/LocalSerializer';
import { LocalStrategy } from './services/auth/LocalStrategy';
import { LoginService } from './services/auth/LoginService';
import { LogoutService } from './services/auth/LogoutService';
import {
	DeleteArtistService,
	DeleteQuoteService,
	DeleteTranslationService,
} from './services/entries/DeleteEntryService';
import {
	ListArtistRevisionsService,
	ListQuoteRevisionsService,
	ListTranslationRevisionsService,
} from './services/entries/ListEntryRevisionsService';
import { PasswordHasherFactory } from './services/passwordHashers/PasswordHasherFactory';
import { CreateQuoteService } from './services/quotes/CreateQuoteService';
import { GetQuoteService } from './services/quotes/GetQuoteService';
import { ListQuoteIdsService } from './services/quotes/ListQuoteIdsService';
import { ListQuotesService } from './services/quotes/ListQuotesService';
import { CreateTranslationService } from './services/translations/CreateTranslationService';
import { GetTranslationService } from './services/translations/GetTranslationService';
import { ListTranslationsService } from './services/translations/ListTranslationsService';
import { UpdateTranslationService } from './services/translations/UpdateTranslationService';
import { AuthenticateUserService } from './services/users/AuthenticateUserService';
import { CreateUserService } from './services/users/CreateUserService';
import { GetAuthenticatedUserService } from './services/users/GetAuthenticatedUserService';
import { GetUserService } from './services/users/GetUserService';
import { ListUsersService } from './services/users/ListUsersService';
import { NormalizeEmailService } from './services/users/NormalizeEmailService';
import { UpdateAuthenticatedUserService } from './services/users/UpdateAuthenticatedUserService';

@Module({
	imports: [
		MikroOrmModule.forRoot(),
		MikroOrmModule.forFeature([
			Artist,
			Quote,
			Translation,
			TranslationRevision,
			User,
		]),
		PassportModule,
	],
	controllers: [
		AuthController,
		ArtistController,
		QuoteController,
		SitemapController,
		TranslationController,
		UserController,
	],
	providers: [
		AuditLogService,
		AuthenticateUserService,
		CreateArtistService,
		CreateQuoteService,
		CreateTranslationService,
		CreateUserService,
		DeleteArtistService,
		DeleteQuoteService,
		DeleteTranslationService,
		GenerateSitemapService,
		GetArtistService,
		GetAuthenticatedUserService,
		GetQuoteService,
		GetTranslationService,
		GetUserService,
		ListArtistIdsService,
		ListArtistRevisionsService,
		ListArtistsService,
		ListQuoteIdsService,
		ListQuoteRevisionsService,
		ListQuotesService,
		ListTranslationRevisionsService,
		ListTranslationsService,
		ListUsersService,
		LocalSerializer,
		LocalStrategy,
		LoginService,
		LogoutService,
		NgramConverter,
		NormalizeEmailService,
		PasswordHasherFactory,
		PermissionContext,
		UpdateAuthenticatedUserService,
		UpdateTranslationService,
	],
})
export class AppModule {}
