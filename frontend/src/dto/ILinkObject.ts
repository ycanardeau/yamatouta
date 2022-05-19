import { IArtistObject } from './IArtistObject';
import { ILinkTypeObject } from './ILinkTypeObject';
import { IPartialDateObject } from './IPartialDateObject';
import { IWorkObject } from './IWorkObject';

interface ILinkObject {
	linkType: ILinkTypeObject;
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
