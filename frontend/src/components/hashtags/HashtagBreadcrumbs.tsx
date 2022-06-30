import { EuiBreadcrumb, EuiBreadcrumbs } from '@elastic/eui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IHashtagObject } from '../../dto/IHashtagObject';

interface HashtagBreadcrumbsProps {
	hashtag?: Pick<IHashtagObject, 'name'>;
}

export const HashtagBreadcrumbs = ({
	hashtag,
}: HashtagBreadcrumbsProps): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	const breadcrumbs = ([] as EuiBreadcrumb[])
		.concat({
			text: t('shared.hashtags'),
			href: '/hashtags',
			onClick: (e): void => {
				e.preventDefault();
				navigate('/hashtags');
			},
		})
		.concat(
			hashtag
				? {
						text: `#${hashtag.name}`,
						href: `/hashtags/${hashtag.name}`,
						onClick: (e): void => {
							e.preventDefault();
							navigate(`/hashtags/${hashtag.name}`);
						},
				  }
				: [],
		);

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};
