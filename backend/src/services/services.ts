import { ArtistLinkService } from './ArtistLinkService';
import { NgramConverter } from './NgramConverter';
import { WebLinkService } from './WebLinkService';
import { WorkLinkService } from './WorkLinkService';
import { AuthService } from './auth/AuthService';
import { LocalSerializer } from './auth/LocalSerializer';
import { LocalStrategy } from './auth/LocalStrategy';
import { PasswordHasherFactory } from './passwordHashers/PasswordHasherFactory';

export const services = [
	ArtistLinkService,
	AuthService,
	LocalSerializer,
	LocalStrategy,
	NgramConverter,
	PasswordHasherFactory,
	WebLinkService,
	WorkLinkService,
];
