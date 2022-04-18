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
import { LocalSerializer } from './services/auth/LocalSerializer';
import { LocalStrategy } from './services/auth/LocalStrategy';
import { LoginService } from './services/auth/LoginService';
import { LogoutService } from './services/auth/LogoutService';
import { CreateMissingRevisionsCommandHandler } from './services/commands/admin/CreateMissingRevisionsCommandHandler';
import { CreateArtistCommandHandler } from './services/commands/artists/CreateArtistCommandHandler';
import { UpdateArtistCommandHandler } from './services/commands/artists/UpdateArtistCommandHandler';
import {
	DeleteArtistCommandHandler,
	DeleteQuoteCommandHandler,
	DeleteTranslationCommandHandler,
	DeleteWorkCommandHandler,
} from './services/commands/entries/DeleteEntryCommandHandler';
import { CreateQuoteCommandHandler } from './services/commands/quotes/CreateQuoteCommandHandler';
import { UpdateQuoteCommandHandler } from './services/commands/quotes/UpdateQuoteCommandHandler';
import { CreateTranslationCommandHandler } from './services/commands/translations/CreateTranslationCommandHandler';
import { UpdateTranslationCommandHandler } from './services/commands/translations/UpdateTranslationCommandHandler';
import { AuthenticateUserCommandHandler } from './services/commands/users/AuthenticateUserCommandHandler';
import { CreateUserCommandHandler } from './services/commands/users/CreateUserCommandHandler';
import { UpdateAuthenticatedUserCommandHandler } from './services/commands/users/UpdateAuthenticatedUserCommandHandler';
import { CreateWorkCommandHandler } from './services/commands/works/CreateWorkCommandHandler';
import { UpdateWorkCommandHandler } from './services/commands/works/UpdateWorkCommandHandler';
import { PasswordHasherFactory } from './services/passwordHashers/PasswordHasherFactory';
import { GetArtistQueryHandler } from './services/queries/artists/GetArtistQueryHandler';
import { ListArtistIdsQueryHandler } from './services/queries/artists/ListArtistIdsQueryHandler';
import { ListArtistsQueryHandler } from './services/queries/artists/ListArtistsQueryHandler';
import {
	ListArtistRevisionsQueryHandler,
	ListQuoteRevisionsQueryHandler,
	ListTranslationRevisionsQueryHandler,
	ListWorkRevisionsQueryHandler,
} from './services/queries/entries/ListEntryRevisionsQueryHandler';
import { GetQuoteQueryHandler } from './services/queries/quotes/GetQuoteQueryHandler';
import { ListQuoteIdsQueryHandler } from './services/queries/quotes/ListQuoteIdsQueryHandler';
import { ListQuotesQueryHandler } from './services/queries/quotes/ListQuotesQueryHandler';
import { GetTranslationQueryHandler } from './services/queries/translations/GetTranslationQueryHandler';
import { ListTranslationsQueryHandler } from './services/queries/translations/ListTranslationsQueryHandler';
import { GetAuthenticatedUserQueryHandler } from './services/queries/users/GetAuthenticatedUserQueryHandler';
import { GetUserQueryHandler } from './services/queries/users/GetUserQueryHandler';
import { ListUsersQueryHandler } from './services/queries/users/ListUsersQueryHandler';
import { GetWorkQueryHandler } from './services/queries/works/GetWorkQueryHandler';
import { ListWorksQueryHandler } from './services/queries/works/ListWorksQueryHandler';

const queryHandlers = [
	GetArtistQueryHandler,
	GetAuthenticatedUserQueryHandler,
	GetQuoteQueryHandler,
	GetTranslationQueryHandler,
	GetUserQueryHandler,
	GetWorkQueryHandler,
	ListArtistIdsQueryHandler,
	ListArtistRevisionsQueryHandler,
	ListArtistsQueryHandler,
	ListQuoteIdsQueryHandler,
	ListQuoteRevisionsQueryHandler,
	ListQuotesQueryHandler,
	ListTranslationRevisionsQueryHandler,
	ListTranslationsQueryHandler,
	ListUsersQueryHandler,
	ListWorkRevisionsQueryHandler,
	ListWorksQueryHandler,
];

const commandHandlers = [
	AuthenticateUserCommandHandler,
	CreateArtistCommandHandler,
	CreateMissingRevisionsCommandHandler,
	CreateQuoteCommandHandler,
	CreateTranslationCommandHandler,
	CreateUserCommandHandler,
	CreateWorkCommandHandler,
	DeleteArtistCommandHandler,
	DeleteQuoteCommandHandler,
	DeleteTranslationCommandHandler,
	DeleteWorkCommandHandler,
	UpdateArtistCommandHandler,
	UpdateQuoteCommandHandler,
	UpdateTranslationCommandHandler,
	UpdateAuthenticatedUserCommandHandler,
	UpdateWorkCommandHandler,
];

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
		...queryHandlers,
		...commandHandlers,
		AuditLogger,
		GenerateSitemapService,
		LocalSerializer,
		LocalStrategy,
		LoginService,
		LogoutService,
		NgramConverter,
		PasswordHasherFactory,
		PermissionContext,
	],
})
export class AppModule {}
