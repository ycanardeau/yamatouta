import { IArtistApiClientProvider } from '@/providers.abstractions/IArtistApiClientProvider';
import { LocalDbArtistApiClientProvider } from '@/providers.local-db/LocalDbArtistApiClientProvider';
import { ArtistApiClientProvider } from '@/providers/ArtistApiClientProvider';

export const artistApi: IArtistApiClientProvider = true
	? new LocalDbArtistApiClientProvider()
	: new ArtistApiClientProvider();
