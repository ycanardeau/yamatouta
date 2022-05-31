import { ArtistDeleteCommandHandler } from '../EntryDeleteCommandHandler';
import { ArtistUpdateCommandHandler } from './ArtistUpdateCommandHandler';

export const artistCommandHandlers = [
	ArtistDeleteCommandHandler,
	ArtistUpdateCommandHandler,
];
