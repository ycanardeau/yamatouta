import { AdminController } from './AdminController';
import { ArtistController } from './ArtistController';
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
	QuoteController,
	SettingsController,
	TranslationController,
	UserController,
	WorkController,
];
