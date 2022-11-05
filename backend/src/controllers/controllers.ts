import { AdminController } from '@/controllers/AdminController';
import { ArtistController } from '@/controllers/ArtistController';
import { HashtagController } from '@/controllers/HashtagController';
import { HomeController } from '@/controllers/HomeController';
import { QuoteController } from '@/controllers/QuoteController';
import { SettingsController } from '@/controllers/SettingsController';
import { TranslationController } from '@/controllers/TranslationController';
import { UserController } from '@/controllers/UserController';
import { WorkController } from '@/controllers/WorkController';
import { apiControllers } from '@/controllers/api/apiControllers';

export const controllers = [
	...apiControllers,
	AdminController,
	ArtistController,
	HashtagController,
	HomeController,
	QuoteController,
	SettingsController,
	TranslationController,
	UserController,
	WorkController,
];
