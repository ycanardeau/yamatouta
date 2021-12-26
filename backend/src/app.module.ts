import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ArtistController } from './controllers/ArtistController';
import { AuthController } from './controllers/AuthController';
import { QuoteController } from './controllers/QuoteController';
import { UserController } from './controllers/UserController';
import { Artist } from './entities/Artist';
import { Quote } from './entities/Quote';
import { User } from './entities/User';
import { AuditLogService } from './services/AuditLogService';
import { GetArtistService } from './services/artists/GetArtistService';
import { ListArtistsService } from './services/artists/ListArtistsService';
import { LocalSerializer } from './services/auth/LocalSerializer';
import { LocalStrategy } from './services/auth/LocalStrategy';
import { LoginService } from './services/auth/LoginService';
import { LogoutService } from './services/auth/LogoutService';
import { PasswordHasherFactory } from './services/passwordHashers/PasswordHasherFactory';
import { GetQuoteService } from './services/quotes/GetQuoteService';
import { ListQuotesService } from './services/quotes/ListQuotesService';
import { AuthenticateUserService } from './services/users/AuthenticateUserService';
import { CreateUserService } from './services/users/CreateUserService';
import { GetUserService } from './services/users/GetUserService';
import { ListUsersService } from './services/users/ListUsersService';
import { NormalizeEmailService } from './services/users/NormalizeEmailService';
import { UpdatePasswordService } from './services/users/UpdatePasswordService';

@Module({
	imports: [
		MikroOrmModule.forRoot(),
		MikroOrmModule.forFeature([Artist, Quote, User]),
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
		PasswordHasherFactory,
		UpdatePasswordService,
	],
})
export class AppModule {}
