import { IHashtagDto } from '@/dto/IHashtagDto';
import {
	EuiBreadcrumb,
	EuiPageHeaderProps,
	EuiPageTemplate,
} from '@elastic/eui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface HashtagPageProps {
	hashtag?: IHashtagDto;
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
			<EuiPageTemplate.Header
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
									href: `/hashtags/${encodeURIComponent(
										hashtag.name,
									)}`,
									onClick: (e): void => {
										e.preventDefault();
										navigate(
											`/hashtags/${encodeURIComponent(
												hashtag.name,
											)}`,
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
