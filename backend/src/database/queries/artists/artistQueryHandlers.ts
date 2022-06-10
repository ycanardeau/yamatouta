import { ArtistListRevisionsQueryHandler } from '../EntryListRevisionsQueryHandler';
import { ArtistGetQueryHandler } from './ArtistGetQueryHandler';
import { ArtistListQueryHandler } from './ArtistListQueryHandler';

export const artistQueryHandlers = [
	ArtistGetQueryHandler,
	ArtistListQueryHandler,
	ArtistListRevisionsQueryHandler,
];
