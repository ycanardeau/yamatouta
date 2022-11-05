import { IArtistObject } from '@/dto/IArtistObject';
import { IPartialDateObject } from '@/dto/IPartialDateObject';
import { IWorkObject } from '@/dto/IWorkObject';
import { LinkType } from '@/models/LinkType';

interface ILinkObject {
	linkType: LinkType;
	beginDate: IPartialDateObject;
	endDate: IPartialDateObject;
	ended: boolean;
}

export interface IArtistLinkObject extends ILinkObject {
	id: number;
	relatedArtist: IArtistObject;
}

export interface IWorkLinkObject extends ILinkObject {
	id: number;
	relatedWork: IWorkObject;
}
