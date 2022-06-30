import {
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiPageHeaderProps,
	EuiSpacer,
} from '@elastic/eui';
import React from 'react';

import { IHashtagObject } from '../../dto/IHashtagObject';
import { HashtagBreadcrumbs } from './HashtagBreadcrumbs';

interface HashtagPageProps {
	hashtag: IHashtagObject;
	pageHeaderProps?: EuiPageHeaderProps;
	children?: React.ReactNode;
}

export const HashtagPage = ({
	hashtag,
	pageHeaderProps,
	children,
}: HashtagPageProps): React.ReactElement => {
	return (
		<>
			<HashtagBreadcrumbs hashtag={hashtag} />
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
