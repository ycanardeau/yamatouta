import config from '@/config';
import i18n from 'i18next';

const locales = ['en', 'ja'];

i18n.init({
	lng: 'ja',
	fallbackLng: 'en',
	interpolation: {
		escapeValue: true,
	},
	resources: Object.fromEntries(
		locales.map((locale) => [
			locale,
			{
				translation: require(`${config.clientBuildPath}/locales/${locale}/translation.json`),
			},
		]),
	),
});
