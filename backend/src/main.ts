import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);

	app.use(helmet());

	app.useGlobalPipes(new ValidationPipe());

	app.enableCors({
		origin: process.env.ALLOWED_CORS_ORIGINS?.split(','),
	});

	await app.listen(process.env.PORT || 5000);
}
bootstrap();
