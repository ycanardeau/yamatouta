import { ArtistListRevisionsQueryHandler } from '@/database/queries/EntryListRevisionsQueryHandler';
import { ArtistGetQueryHandler } from '@/database/queries/artists/ArtistGetQueryHandler';
import { ArtistListQueryHandler } from '@/database/queries/artists/ArtistListQueryHandler';

export const artistQueryHandlers = [
	ArtistGetQueryHandler,
	ArtistListQueryHandler,
	ArtistListRevisionsQueryHandler,
];
