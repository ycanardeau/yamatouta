import { NestFactory } from '@nestjs/core';
import Ajv from 'ajv';
import { AjvValidationPipe } from 'nestjs-ajv-glue/dist/index';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new AjvValidationPipe(
			new Ajv({ coerceTypes: true, removeAdditional: 'all' }),
		),
	);

	app.enableCors({
		origin: process.env.ALLOWED_CORS_ORIGINS?.split(','),
	});

	await app.listen(process.env.PORT || 5000);
}
bootstrap();
