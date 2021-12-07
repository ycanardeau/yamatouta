import { NotFoundError } from '@mikro-orm/core';
import { Controller, Get, NotFoundException } from '@nestjs/common';
import { AjvParams } from 'nestjs-ajv-glue/dist';

import { ArtistDto } from '../../../dto/artists/ArtistDto';
import { GetArtistService } from './get-artist.service';

interface IGetArtistParams {
	artistId: number;
}

const getArtistParamsSchema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	properties: {
		artistId: {
			type: 'number',
		},
	},
	required: ['artistId'],
	type: 'object',
};

@Controller()
export class GetArtistController {
	constructor(private readonly service: GetArtistService) {}

	@Get('artists/:artistId')
	async getArtist(
		@AjvParams(getArtistParamsSchema) { artistId }: IGetArtistParams,
	): Promise<ArtistDto> {
		try {
			return await this.service.getArtist(artistId);
		} catch (error) {
			if (error instanceof NotFoundError) throw new NotFoundException();
			throw error;
		}
	}
}
