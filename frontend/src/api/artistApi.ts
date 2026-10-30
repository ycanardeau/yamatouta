import { IArtistApi } from '@/api/IArtistApi';
import { HttpArtistApi } from '@/api/http/HttpArtistApi';
import { JsonArtistApi } from '@/api/json/JsonArtistApi';
import config from '@/config';

export const artistApi: IArtistApi =
	config.dataSource === 'json' ? new JsonArtistApi() : new HttpArtistApi();
