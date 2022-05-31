import { EuiBreadcrumb, EuiBreadcrumbs } from '@elastic/eui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ITranslationObject } from '../../dto/ITranslationObject';

interface TranslationBreadcrumbsProps {
	translation?: Pick<ITranslationObject, 'id' | 'headword' | 'yamatokotoba'>;
}

export const TranslationBreadcrumbs = ({
	translation,
}: TranslationBreadcrumbsProps): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	const breadcrumbs = ([] as EuiBreadcrumb[])
		.concat({
			text: t('shared.words'),
			href: '/translations',
			onClick: (e): void => {
				e.preventDefault();
				navigate('/translations');
			},
		})
		.concat(
			translation
				? {
						text: `${translation.headword} ↔ ${translation.yamatokotoba}`,
						href: `/translations/${translation.id}`,
						onClick: (e): void => {
							e.preventDefault();
							navigate(`/translations/${translation.id}`);
						},
				  }
				: [],
		);

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};
