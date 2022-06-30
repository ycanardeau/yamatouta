import { ArtistLinkService } from './ArtistLinkService';
import { HashtagLinkService } from './HashtagLinkService';
import { NgramConverter } from './NgramConverter';
import { RevisionService } from './RevisionService';
import { SitemapService } from './SitemapService';
import { WebLinkService } from './WebLinkService';
import { WorkLinkService } from './WorkLinkService';
import { AuthService } from './auth/AuthService';
import { LocalSerializer } from './auth/LocalSerializer';
import { LocalStrategy } from './auth/LocalStrategy';
import { PasswordHasherFactory } from './passwordHashers/PasswordHasherFactory';

export const services = [
	ArtistLinkService,
	AuthService,
	HashtagLinkService,
	LocalSerializer,
	LocalStrategy,
	NgramConverter,
	PasswordHasherFactory,
	RevisionService,
	SitemapService,
	WebLinkService,
	WorkLinkService,
];
