import { AdminApiController } from '@/controllers/api/AdminApiController';
import { ArtistApiController } from '@/controllers/api/ArtistApiController';
import { AuthApiController } from '@/controllers/api/AuthApiController';
import { HashtagApiController } from '@/controllers/api/HashtagApiController';
import { QuoteApiController } from '@/controllers/api/QuoteApiController';
import { TranslationApiController } from '@/controllers/api/TranslationApiController';
import { UserApiController } from '@/controllers/api/UserApiController';
import { WorkApiController } from '@/controllers/api/WorkApiController';

export const apiControllers = [
	AdminApiController,
	AuthApiController,
	ArtistApiController,
	HashtagApiController,
	QuoteApiController,
	TranslationApiController,
	UserApiController,
	WorkApiController,
];
