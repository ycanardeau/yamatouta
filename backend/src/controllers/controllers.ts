import { AdminController } from './AdminController';
import { ArtistController } from './ArtistController';
import { HashtagController } from './HashtagController';
import { HomeController } from './HomeController';
import { QuoteController } from './QuoteController';
import { SettingsController } from './SettingsController';
import { TranslationController } from './TranslationController';
import { UserController } from './UserController';
import { WorkController } from './WorkController';
import { apiControllers } from './api/apiControllers';

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
