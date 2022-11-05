import { WebLinkCategory } from '@/models/WebLinkCategory';

export interface IWebLinkDto {
	id: number;
	url: string;
	title: string;
	category: WebLinkCategory;
}
