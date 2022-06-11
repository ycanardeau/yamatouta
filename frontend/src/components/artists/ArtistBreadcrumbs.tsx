import { EuiBreadcrumb, EuiBreadcrumbs } from '@elastic/eui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IArtistObject } from '../../dto/IArtistObject';
import { EntryUrlMapper } from '../../models/EntryUrlMapper';

interface ArtistBreadcrumbsProps {
	artist?: Pick<IArtistObject, 'id' | 'entryType' | 'name'>;
}

export const ArtistBreadcrumbs = ({
	artist,
}: ArtistBreadcrumbsProps): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	const breadcrumbs = ([] as EuiBreadcrumb[])
		.concat({
			text: t('shared.artists'),
			href: '/artists',
			onClick: (e): void => {
				e.preventDefault();
				navigate('/artists');
			},
		})
		.concat(
			artist
				? {
						text: artist.name,
						href: EntryUrlMapper.details(artist),
						onClick: (e): void => {
							e.preventDefault();
							navigate(EntryUrlMapper.details(artist));
						},
				  }
				: [],
		);

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};
