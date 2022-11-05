import { IUserDto } from '@/dto/IUserDto';
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

interface UserPageProps {
	user?: IUserDto;
	pageHeaderProps?: EuiPageHeaderProps;
	children?: React.ReactNode;
}

export const UserPage = ({
	user,
	pageHeaderProps,
	children,
}: UserPageProps): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	return (
		<>
			<EuiPageHeader
				{...pageHeaderProps}
				restrictWidth
				breadcrumbs={([] as EuiBreadcrumb[])
					.concat({
						text: t('shared.users'),
						href: '/users',
						onClick: (e): void => {
							e.preventDefault();
							navigate('/users');
						},
					})
					.concat(
						user
							? {
									text: user.name,
									href: EntryUrlMapper.details(user),
									onClick: (e): void => {
										e.preventDefault();
										navigate(EntryUrlMapper.details(user));
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
