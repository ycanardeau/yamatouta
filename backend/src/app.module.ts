import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AdminController } from './controllers/AdminController';
import { ArtistController } from './controllers/ArtistController';
import { AuthController } from './controllers/AuthController';
import { QuoteController } from './controllers/QuoteController';
import { SitemapController } from './controllers/SitemapController';
import { TranslationController } from './controllers/TranslationController';
import { UserController } from './controllers/UserController';
import { WorkController } from './controllers/WorkController';
import { Artist } from './entities/Artist';
import { Quote } from './entities/Quote';
import { TranslationRevision } from './entities/Revision';
import { Translation } from './entities/Translation';
import { User } from './entities/User';
import { Work } from './entities/Work';
import { AuditLogger } from './services/AuditLogger';
import { GenerateSitemapService } from './services/GenerateSitemapService';
import { NgramConverter } from './services/NgramConverter';
import { PermissionContext } from './services/PermissionContext';
import { CreateMissingRevisionsService } from './services/admin/CreateMissingRevisionsService';
import { CreateArtistService } from './services/artists/CreateArtistService';
import { GetArtistService } from './services/artists/GetArtistService';
import { ListArtistIdsService } from './services/artists/ListArtistIdsService';
import { ListArtistsService } from './services/artists/ListArtistsService';
import { UpdateArtistService } from './services/artists/UpdateArtistService';
import { LocalSerializer } from './services/auth/LocalSerializer';
import { LocalStrategy } from './services/auth/LocalStrategy';
import { LoginService } from './services/auth/LoginService';
import { LogoutService } from './services/auth/LogoutService';
import {
	DeleteArtistService,
	DeleteQuoteService,
	DeleteTranslationService,
	DeleteWorkService,
} from './services/entries/DeleteEntryService';
import {
	ListArtistRevisionsService,
	ListQuoteRevisionsService,
	ListTranslationRevisionsService,
	ListWorkRevisionsService,
} from './services/entries/ListEntryRevisionsService';
import { PasswordHasherFactory } from './services/passwordHashers/PasswordHasherFactory';
import { CreateQuoteService } from './services/quotes/CreateQuoteService';
import { GetQuoteService } from './services/quotes/GetQuoteService';
import { ListQuoteIdsService } from './services/quotes/ListQuoteIdsService';
import { ListQuotesService } from './services/quotes/ListQuotesService';
import { UpdateQuoteService } from './services/quotes/UpdateQuoteService';
import { CreateTranslationService } from './services/translations/CreateTranslationService';
import { GetTranslationService } from './services/translations/GetTranslationService';
import { ListTranslationsService } from './services/translations/ListTranslationsService';
import { UpdateTranslationService } from './services/translations/UpdateTranslationService';
import { AuthenticateUserService } from './services/users/AuthenticateUserService';
import { CreateUserService } from './services/users/CreateUserService';
import { GetAuthenticatedUserService } from './services/users/GetAuthenticatedUserService';
import { GetUserService } from './services/users/GetUserService';
import { ListUsersService } from './services/users/ListUsersService';
import { UpdateAuthenticatedUserService } from './services/users/UpdateAuthenticatedUserService';
import { CreateWorkService } from './services/works/CreateWorkService';
import { GetWorkService } from './services/works/GetWorkService';
import { ListWorksService } from './services/works/ListWorksService';
import { UpdateWorkService } from './services/works/UpdateWorkService';

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
	],
	controllers: [
		AdminController,
		AuthController,
		ArtistController,
		QuoteController,
		SitemapController,
		TranslationController,
		UserController,
		WorkController,
	],
	providers: [
		AuditLogger,
		AuthenticateUserService,
		CreateArtistService,
		CreateMissingRevisionsService,
		CreateQuoteService,
		CreateTranslationService,
		CreateUserService,
		CreateWorkService,
		DeleteArtistService,
		DeleteQuoteService,
		DeleteTranslationService,
		DeleteWorkService,
		GenerateSitemapService,
		GetArtistService,
		GetAuthenticatedUserService,
		GetQuoteService,
		GetTranslationService,
		GetUserService,
		GetWorkService,
		ListArtistIdsService,
		ListArtistRevisionsService,
		ListArtistsService,
		ListQuoteIdsService,
		ListQuoteRevisionsService,
		ListQuotesService,
		ListTranslationRevisionsService,
		ListTranslationsService,
		ListUsersService,
		ListWorkRevisionsService,
		ListWorksService,
		LocalSerializer,
		LocalStrategy,
		LoginService,
		LogoutService,
		NgramConverter,
		PasswordHasherFactory,
		PermissionContext,
		UpdateAuthenticatedUserService,
		UpdateArtistService,
		UpdateQuoteService,
		UpdateTranslationService,
		UpdateWorkService,
	],
})
export class AppModule {}
