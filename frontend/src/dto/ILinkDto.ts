import { IArtistDto } from '@/dto/IArtistDto';
import { IPartialDateDto } from '@/dto/IPartialDateDto';
import { IWorkDto } from '@/dto/IWorkDto';
import { LinkType } from '@/models/LinkType';

interface ILinkDto {
	linkType: LinkType;
	beginDate: IPartialDateDto;
	endDate: IPartialDateDto;
	ended: boolean;
}

export interface IArtistLinkDto extends ILinkDto {
	id: number;
	relatedArtist: IArtistDto;
}

export interface IWorkLinkDto extends ILinkDto {
	id: number;
	relatedWork: IWorkDto;
}
