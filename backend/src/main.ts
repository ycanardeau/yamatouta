import { MikroORM, RequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mariadb';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import connectSessionKnex from 'connect-session-knex';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import passport from 'passport';
import { join } from 'path';

import { AppModule } from './AppModule';
import config from './config';
import './i18n';

const KnexSessionStore = connectSessionKnex(session);

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.use(helmet());

	app.useStaticAssets(config.clientBuildPath);
	app.setBaseViewsDir(join(__dirname, '..', 'views'));
	app.setViewEngine('hbs');

	app.enableCors({
		origin: config.cors.allowedOrigins,
		credentials: true,
	});

	app.use(cookieParser());

	// See https://mikro-orm.io/docs/identity-map#-requestcontext-helper-for-di-containers.
	app.use((request: Request, response: Response, next: NextFunction) => {
		const orm = app.get<MikroORM>(MikroORM);

		RequestContext.create(orm.em, next);
	});

	// TODO: Replace with connect-redis.
	app.use(
		session({
			secret: config.session.secret,
			resave: false,
			saveUninitialized: false,
			store: new KnexSessionStore({
				knex: app.get(EntityManager).getKnex() as unknown as any,
			}),
		}),
	);

	app.use(passport.initialize());
	app.use(passport.session());

	if (process.env.NODE_ENV !== 'development') {
		app.use(
			csurf({
				cookie: {
					httpOnly: true,
					domain: config.cookie.domain,
				},
			}),
		);

		app.use((request: Request, response: Response, next: NextFunction) => {
			response.cookie('XSRF-TOKEN', request.csrfToken(), {
				domain: config.cookie.domain,
			});

			next();
		});
	}

	await app.listen(config.port);
}
bootstrap();
