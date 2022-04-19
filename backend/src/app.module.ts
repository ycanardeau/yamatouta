import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';

import { AdminController } from './controllers/AdminController';
import { ArtistController } from './controllers/ArtistController';
import { AuthController } from './controllers/AuthController';
import { QuoteController } from './controllers/QuoteController';
import { SitemapController } from './controllers/SitemapController';
import { TranslationController } from './controllers/TranslationController';
import { UserController } from './controllers/UserController';
import { WorkController } from './controllers/WorkController';
import { CreateMissingRevisionsCommandHandler } from './database/commands/admin/CreateMissingRevisionsCommandHandler';
import { CreateArtistCommandHandler } from './database/commands/artists/CreateArtistCommandHandler';
import { UpdateArtistCommandHandler } from './database/commands/artists/UpdateArtistCommandHandler';
import {
	DeleteArtistCommandHandler,
	DeleteQuoteCommandHandler,
	DeleteTranslationCommandHandler,
	DeleteWorkCommandHandler,
} from './database/commands/entries/DeleteEntryCommandHandler';
import { CreateQuoteCommandHandler } from './database/commands/quotes/CreateQuoteCommandHandler';
import { UpdateQuoteCommandHandler } from './database/commands/quotes/UpdateQuoteCommandHandler';
import { CreateTranslationCommandHandler } from './database/commands/translations/CreateTranslationCommandHandler';
import { UpdateTranslationCommandHandler } from './database/commands/translations/UpdateTranslationCommandHandler';
import { AuthenticateUserCommandHandler } from './database/commands/users/AuthenticateUserCommandHandler';
import { CreateUserCommandHandler } from './database/commands/users/CreateUserCommandHandler';
import { UpdateAuthenticatedUserCommandHandler } from './database/commands/users/UpdateAuthenticatedUserCommandHandler';
import { CreateWorkCommandHandler } from './database/commands/works/CreateWorkCommandHandler';
import { UpdateWorkCommandHandler } from './database/commands/works/UpdateWorkCommandHandler';
import { GetArtistQueryHandler } from './database/queries/artists/GetArtistQueryHandler';
import { ListArtistIdsQueryHandler } from './database/queries/artists/ListArtistIdsQueryHandler';
import { ListArtistsQueryHandler } from './database/queries/artists/ListArtistsQueryHandler';
import {
	ListArtistRevisionsQueryHandler,
	ListQuoteRevisionsQueryHandler,
	ListTranslationRevisionsQueryHandler,
	ListWorkRevisionsQueryHandler,
} from './database/queries/entries/ListEntryRevisionsQueryHandler';
import { GetQuoteQueryHandler } from './database/queries/quotes/GetQuoteQueryHandler';
import { ListQuoteIdsQueryHandler } from './database/queries/quotes/ListQuoteIdsQueryHandler';
import { ListQuotesQueryHandler } from './database/queries/quotes/ListQuotesQueryHandler';
import { GenerateSitemapQueryHandler } from './database/queries/sitemap/GenerateSitemapQueryHandler';
import { GetTranslationQueryHandler } from './database/queries/translations/GetTranslationQueryHandler';
import { ListTranslationsQueryHandler } from './database/queries/translations/ListTranslationsQueryHandler';
import { GetAuthenticatedUserQueryHandler } from './database/queries/users/GetAuthenticatedUserQueryHandler';
import { GetUserQueryHandler } from './database/queries/users/GetUserQueryHandler';
import { ListUsersQueryHandler } from './database/queries/users/ListUsersQueryHandler';
import { GetWorkQueryHandler } from './database/queries/works/GetWorkQueryHandler';
import { ListWorksQueryHandler } from './database/queries/works/ListWorksQueryHandler';
import { Artist } from './entities/Artist';
import { Quote } from './entities/Quote';
import { TranslationRevision } from './entities/Revision';
import { Translation } from './entities/Translation';
import { User } from './entities/User';
import { Work } from './entities/Work';
import { AuditLogEntryFactory } from './services/AuditLogEntryFactory';
import { NgramConverter } from './services/NgramConverter';
import { PermissionContext } from './services/PermissionContext';
import { AuthService } from './services/auth/AuthService';
import { LocalSerializer } from './services/auth/LocalSerializer';
import { LocalStrategy } from './services/auth/LocalStrategy';
import { PasswordHasherFactory } from './services/passwordHashers/PasswordHasherFactory';

const queryHandlers = [
	GenerateSitemapQueryHandler,
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
		CqrsModule,
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
		AuditLogEntryFactory,
		AuthService,
		LocalSerializer,
		LocalStrategy,
		NgramConverter,
		PasswordHasherFactory,
		PermissionContext,
	],
})
export class AppModule {}
