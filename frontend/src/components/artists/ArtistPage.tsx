import { IArtistDto } from '@/dto/IArtistDto';
import { EntryUrlMapper } from '@/models/EntryUrlMapper';
import {
	EuiBreadcrumb,
	EuiPageHeaderProps,
	EuiPageTemplate,
} from '@elastic/eui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface ArtistPageProps {
	artist?: IArtistDto;
	pageHeaderProps?: EuiPageHeaderProps;
	children?: React.ReactNode;
}

export const ArtistPage = ({
	artist,
	pageHeaderProps,
	children,
}: ArtistPageProps): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	return (
		<>
			<EuiPageTemplate.Header
				{...pageHeaderProps}
				restrictWidth
				breadcrumbs={([] as EuiBreadcrumb[])
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
										navigate(
											EntryUrlMapper.details(artist),
										);
									},
							  }
							: [],
					)}
			/>
			<EuiPageTemplate.Section restrictWidth>
				{children}
			</EuiPageTemplate.Section>
		</>
	);
};
