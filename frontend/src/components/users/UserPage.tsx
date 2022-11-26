import { IUserDto } from '@/dto/IUserDto';
import { EntryUrlMapper } from '@/models/EntryUrlMapper';
import '@elastic/eui';
import {
	EuiBreadcrumb,
	EuiPageHeaderProps,
	EuiPageTemplate,
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
			<EuiPageTemplate.Header
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
			<EuiPageTemplate.Section restrictWidth>
				{children}
			</EuiPageTemplate.Section>
		</>
	);
};
