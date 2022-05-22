import {
	EuiCommentList,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiPageHeaderProps,
	EuiSpacer,
} from '@elastic/eui';

import { IUserObject } from '../../dto/IUserObject';
import { useYamatoutaTitle } from '../useYamatoutaTitle';
import UserBreadcrumbs from './UserBreadcrumbs';

interface UserPageProps {
	user: IUserObject;
	pageHeaderProps?: EuiPageHeaderProps;
	children?: React.ReactNode;
}

const UserPage = ({
	user,
	pageHeaderProps,
	children,
}: UserPageProps): React.ReactElement => {
	const title = user.name;

	useYamatoutaTitle(title, true);

	return (
		<>
			<UserBreadcrumbs user={user} />
			<EuiSpacer size="xs" />
			<EuiPageHeader pageTitle={title} {...pageHeaderProps} />

			<EuiPageContent
				hasBorder={false}
				hasShadow={false}
				paddingSize="none"
				color="transparent"
				borderRadius="none"
			>
				<EuiPageContentBody>
					<EuiCommentList>{children}</EuiCommentList>
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
};

export default UserPage;
