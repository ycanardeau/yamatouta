import config from '@/config';
import { Response } from 'express';
import { t } from 'i18next';

const assetManifest: {
	files: { 'main.css': string; 'main.js': string };
} =
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	require(`${config.clientBuildPath}/asset-manifest.json`);

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
		script: assetManifest.files['main.js'],
		style: assetManifest.files['main.css'],
		gaMeasurementId: config.gaMeasurementId,
	});
};
