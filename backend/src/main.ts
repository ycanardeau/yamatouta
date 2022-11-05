import { AppModule } from '@/AppModule';
import config from '@/config';
import '@/i18n';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mariadb';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import connectSessionKnex from 'connect-session-knex';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import csurf from 'csurf';
import { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { IncomingMessage, ServerResponse } from 'http';
import passport from 'passport';
import { join } from 'path';

const KnexSessionStore = connectSessionKnex(session);

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.use((req: Request, res: Response, next: NextFunction) => {
		// Code from: https://github.com/TheBrenny/nonce-express/blob/8794bb436046b858d7c8761871dc90c6cd541640/nonce.js#L16.
		res.locals['nonce'] = crypto.randomBytes(16).toString('base64');

		next();
	});

	app.use(
		helmet({
			contentSecurityPolicy: {
				useDefaults: true,
				directives: {
					scriptSrc: [
						"'self'",
						(req: IncomingMessage, res: ServerResponse): string =>
							`'nonce-${(res as Response).locals['nonce']}'`,
						...config.contentSecurityPolicy.scriptSrc,
					],
					imgSrc: [
						"'self'",
						'data:',
						...config.contentSecurityPolicy.imgSrc,
					],
					connectSrc: [
						"'self'",
						...config.contentSecurityPolicy.connectSrc,
					],
				},
			},
		}),
	);

	app.useStaticAssets(config.clientBuildPath, { index: false });
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
