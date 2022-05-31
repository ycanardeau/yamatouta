import { LinkType } from '../models/LinkType';
import { IArtistObject } from './IArtistObject';
import { IPartialDateObject } from './IPartialDateObject';
import { IWorkObject } from './IWorkObject';

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
