import { EntityManager } from '@mikro-orm/mariadb';
import { NestFactory } from '@nestjs/core';
import connectSessionKnex from 'connect-session-knex';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import passport from 'passport';

import { AppModule } from './app.module';
import config from './config';

const KnexSessionStore = connectSessionKnex(session);

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);

	app.use(helmet());

	app.enableCors({
		origin: config.cors.allowedOrigins,
		credentials: true,
	});

	app.use(cookieParser());

	// TODO: Replace with connect-redis.
	app.use(
		session({
			secret: config.session.secret,
			resave: false,
			saveUninitialized: false,
			store: new KnexSessionStore({
				knex: app
					.get<EntityManager>(EntityManager)
					.getKnex() as unknown as any,
			}),
		}),
	);

	app.use(passport.initialize());
	app.use(passport.session());

	app.use(
		csurf({
			cookie: {
				httpOnly: true,
			},
		}),
	);

	app.use((request: Request, response: Response, next: NextFunction) => {
		response.cookie('XSRF-TOKEN', request.csrfToken());

		next();
	});

	await app.listen(config.port);
}
bootstrap();
