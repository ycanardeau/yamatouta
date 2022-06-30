import {
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiPageHeaderProps,
	EuiSpacer,
} from '@elastic/eui';

import { IArtistObject } from '../../dto/IArtistObject';
import { ArtistBreadcrumbs } from './ArtistBreadcrumbs';

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
	return (
		<>
			<ArtistBreadcrumbs artist={artist} />
			<EuiSpacer size="xs" />
			<EuiPageHeader {...pageHeaderProps} />

			<EuiPageContent
				hasBorder={false}
				hasShadow={false}
				paddingSize="none"
				color="transparent"
				borderRadius="none"
			>
				<EuiPageContentBody>{children}</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
};
