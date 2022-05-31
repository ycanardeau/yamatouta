import { ArtistListRevisionsQueryHandler } from '../EntryListRevisionsQueryHandler';
import { ArtistGetQueryHandler } from './ArtistGetQueryHandler';
import { ArtistListIdsQueryHandler } from './ArtistListIdsQueryHandler';
import { ArtistListQueryHandler } from './ArtistListQueryHandler';

export const artistQueryHandlers = [
	ArtistGetQueryHandler,
	ArtistListIdsQueryHandler,
	ArtistListQueryHandler,
	ArtistListRevisionsQueryHandler,
];
