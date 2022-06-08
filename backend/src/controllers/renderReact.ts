import { Response } from 'express';
import { t } from 'i18next';

import config from '../config';

const assetManifest: {
	files: { 'main.css': string; 'main.js': string };
} =
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	require(`${config.clientBuildPath}/asset-manifest.json`);

interface IPageMetadata {
	title?: string;
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
		description: pageMetadata.description || t('layout.siteDescription'),
		image: pageMetadata.image,
		script: assetManifest.files['main.js'],
		style: assetManifest.files['main.css'],
		gaMeasurementId: config.gaMeasurementId,
	});
};
