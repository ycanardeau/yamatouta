import config from '@/config';
import { Response } from 'express';
import { t } from 'i18next';

const assetManifest: {
	'index.html': { file: string; css: string[] };
} =
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	require(`${config.clientBuildPath}/manifest.json`);

interface IPageMetadata {
	title?: string;
	keywords?: string;
	description?: string;
	image?: string;
}

export const renderReact = (
	response: Response,
	pageMetadata: IPageMetadata = {},
): void => {
	return response.render('index', {
		title: pageMetadata.title
			? `${pageMetadata.title} - やまとうた`
			: 'やまとうた',
		keywords: pageMetadata.keywords || t('meta.keywords'),
		description: pageMetadata.description || t('meta.description'),
		image: pageMetadata.image,
		script: assetManifest['index.html'].file,
		style: assetManifest['index.html'].css[0],
		gaMeasurementId: config.gaMeasurementId,
	});
};
