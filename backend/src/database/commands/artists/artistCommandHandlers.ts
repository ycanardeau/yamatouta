import { ArtistDeleteCommandHandler } from '@/database/commands/EntryDeleteCommandHandler';
import { ArtistUpdateCommandHandler } from '@/database/commands/artists/ArtistUpdateCommandHandler';

export const artistCommandHandlers = [
	ArtistDeleteCommandHandler,
	ArtistUpdateCommandHandler,
];
