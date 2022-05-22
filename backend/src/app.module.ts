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
import { AdminCreateMissingRevisionsCommandHandler } from './database/commands/admin/AdminCreateMissingRevisionsCommandHandler';
import { ArtistUpdateCommandHandler } from './database/commands/artists/ArtistUpdateCommandHandler';
import {
	ArtistDeleteCommandHandler,
	QuoteDeleteCommandHandler,
	TranslationDeleteCommandHandler,
	WorkDeleteCommandHandler,
} from './database/commands/entries/EntryDeleteCommandHandler';
import { QuoteUpdateCommandHandler } from './database/commands/quotes/QuoteUpdateCommandHandler';
import { TranslationUpdateCommandHandler } from './database/commands/translations/TranslationUpdateCommandHandler';
import { UserAuthenticateCommandHandler } from './database/commands/users/UserAuthenticateCommandHandler';
import { UserCreateCommandHandler } from './database/commands/users/UserCreateCommandHandler';
import { UserUpdateCommandHandler } from './database/commands/users/UserUpdateCommandHandler';
import { WorkUpdateCommandHandler } from './database/commands/works/WorkUpdateCommandHandler';
import { ArtistGetQueryHandler } from './database/queries/artists/ArtistGetQueryHandler';
import { ArtistListIdsQueryHandler } from './database/queries/artists/ArtistListIdsQueryHandler';
import { ArtistListQueryHandler } from './database/queries/artists/ArtistListQueryHandler';
import {
	ArtistListRevisionsQueryHandler,
	QuoteListRevisionsQueryHandler,
	TranslationListRevisionsQueryHandler,
	WorkListRevisionsQueryHandler,
} from './database/queries/entries/EntryListRevisionsQueryHandler';
import { QuoteGetQueryHandler } from './database/queries/quotes/QuoteGetQueryHandler';
import { QuoteListIdsQueryHandler } from './database/queries/quotes/QuoteListIdsQueryHandler';
import { QuoteListQueryHandler } from './database/queries/quotes/QuoteListQueryHandler';
import { SitemapGenerateQueryHandler } from './database/queries/sitemap/SitemapGenerateQueryHandler';
import { TranslationGetQueryHandler } from './database/queries/translations/TranslationGetQueryHandler';
import { TranslationListIdsQueryHandler } from './database/queries/translations/TranslationListIdsQueryHandler';
import { TranslationListQueryHandler } from './database/queries/translations/TranslationListQueryHandler';
import { UserGetCurrentQueryHandler } from './database/queries/users/UserGetCurrentQueryHandler';
import { UserGetQueryHandler } from './database/queries/users/UserGetQueryHandler';
import { UserListQueryHandler } from './database/queries/users/UserListQueryHandler';
import { WorkGetQueryHandler } from './database/queries/works/WorkGetQueryHandler';
import { WorkListIdsQueryHandler } from './database/queries/works/WorkListIdsQueryHandler';
import { WorkListQueryHandler } from './database/queries/works/WorkListQueryHandler';
import { Artist } from './entities/Artist';
import { Quote } from './entities/Quote';
import { TranslationRevision } from './entities/Revision';
import { Translation } from './entities/Translation';
import { User } from './entities/User';
import { Work } from './entities/Work';
import { NgramConverter } from './services/NgramConverter';
import { WebAddressFactory } from './services/WebAddressFactory';
import { AuthService } from './services/auth/AuthService';
import { LocalSerializer } from './services/auth/LocalSerializer';
import { LocalStrategy } from './services/auth/LocalStrategy';
import { PasswordHasherFactory } from './services/passwordHashers/PasswordHasherFactory';

const queryHandlers = [
	ArtistGetQueryHandler,
	ArtistListIdsQueryHandler,
	ArtistListQueryHandler,
	ArtistListRevisionsQueryHandler,
	QuoteGetQueryHandler,
	QuoteListIdsQueryHandler,
	QuoteListQueryHandler,
	QuoteListRevisionsQueryHandler,
	SitemapGenerateQueryHandler,
	TranslationGetQueryHandler,
	TranslationListIdsQueryHandler,
	TranslationListQueryHandler,
	TranslationListRevisionsQueryHandler,
	UserGetCurrentQueryHandler,
	UserGetQueryHandler,
	UserListQueryHandler,
	WorkGetQueryHandler,
	WorkListIdsQueryHandler,
	WorkListQueryHandler,
	WorkListRevisionsQueryHandler,
];

const commandHandlers = [
	AdminCreateMissingRevisionsCommandHandler,
	ArtistDeleteCommandHandler,
	ArtistUpdateCommandHandler,
	QuoteDeleteCommandHandler,
	QuoteUpdateCommandHandler,
	TranslationDeleteCommandHandler,
	TranslationUpdateCommandHandler,
	UserAuthenticateCommandHandler,
	UserCreateCommandHandler,
	UserUpdateCommandHandler,
	WorkDeleteCommandHandler,
	WorkUpdateCommandHandler,
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
		AuthService,
		LocalSerializer,
		LocalStrategy,
		NgramConverter,
		PasswordHasherFactory,
		WebAddressFactory,
	],
})
export class AppModule {}
