import { ArtistLinkService } from '@/services/ArtistLinkService';
import { HashtagLinkService } from '@/services/HashtagLinkService';
import { NgramConverter } from '@/services/NgramConverter';
import { RevisionService } from '@/services/RevisionService';
import { SitemapService } from '@/services/SitemapService';
import { WebLinkService } from '@/services/WebLinkService';
import { WorkLinkService } from '@/services/WorkLinkService';
import { AuthService } from '@/services/auth/AuthService';
import { LocalSerializer } from '@/services/auth/LocalSerializer';
import { LocalStrategy } from '@/services/auth/LocalStrategy';
import { PasswordHasherFactory } from '@/services/passwordHashers/PasswordHasherFactory';

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
