import { IHashtagObject } from '@/dto/IHashtagObject';
import {
	EuiBreadcrumb,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiPageHeaderProps,
} from '@elastic/eui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface HashtagPageProps {
	hashtag?: IHashtagObject;
	pageHeaderProps?: EuiPageHeaderProps;
	children?: React.ReactNode;
}

export const HashtagPage = ({
	hashtag,
	pageHeaderProps,
	children,
}: HashtagPageProps): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	return (
		<>
			<EuiPageHeader
				{...pageHeaderProps}
				restrictWidth
				breadcrumbs={([] as EuiBreadcrumb[])
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
