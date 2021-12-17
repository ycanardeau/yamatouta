import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import helmet from 'helmet';
import passport from 'passport';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);

	app.use(helmet());

	app.useGlobalPipes(new ValidationPipe());

	app.enableCors({
		origin: configService.get('ALLOWED_CORS_ORIGINS').split(','),
		credentials: true,
	});

	app.use(cookieParser());

	// TODO: Replace MemoryStore with a compatible session store.
	app.use(
		session({
			secret: configService.get('SESSION_SECRET') as string,
			resave: false,
			saveUninitialized: false,
		}),
	);

	app.use(passport.initialize());
	app.use(passport.session());

	await app.listen(configService.get('PORT') || 5000);
}
bootstrap();
