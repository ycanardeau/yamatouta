import {
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiPageHeaderProps,
	EuiSpacer,
} from '@elastic/eui';

import { IUserObject } from '../../dto/IUserObject';
import { UserBreadcrumbs } from './UserBreadcrumbs';

interface UserPageProps {
	user: IUserObject;
	pageHeaderProps?: EuiPageHeaderProps;
	children?: React.ReactNode;
}

export const UserPage = ({
	user,
	pageHeaderProps,
	children,
}: UserPageProps): React.ReactElement => {
	return (
		<>
			<UserBreadcrumbs user={user} />
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
