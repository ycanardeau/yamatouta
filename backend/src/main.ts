import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import helmet from 'helmet';
import passport from 'passport';

import { AppModule } from './app.module';
import config from './config';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);

	app.use(helmet());

	app.useGlobalPipes(new ValidationPipe());

	app.enableCors({
		origin: config.cors.allowedOrigins,
		credentials: true,
	});

	app.use(cookieParser());

	// TODO: Replace MemoryStore with a compatible session store.
	app.use(
		session({
			secret: config.session.secret,
			resave: false,
			saveUninitialized: false,
		}),
	);

	app.use(passport.initialize());
	app.use(passport.session());

	await app.listen(config.port);
}
bootstrap();
