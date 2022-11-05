import { IArtistObject } from '@/dto/IArtistObject';
import { EntryUrlMapper } from '@/models/EntryUrlMapper';
import {
	EuiBreadcrumb,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiPageHeaderProps,
} from '@elastic/eui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface ArtistPageProps {
	artist?: IArtistObject;
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
			<EuiPageHeader
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

			<EuiPageContent
				hasBorder={false}
				hasShadow={false}
				paddingSize="none"
				color="transparent"
				borderRadius="none"
			>
				<EuiPageContentBody restrictWidth>
					{children}
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
};
