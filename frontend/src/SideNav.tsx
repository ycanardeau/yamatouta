import {
	EuiIcon,
	EuiSideNav,
	EuiSideNavItemType,
	htmlIdGenerator,
} from '@elastic/eui';
import {
	CalligraphyPenRegular,
	MusicNote2Regular,
	PersonAddRegular,
	PersonRegular,
	SettingsRegular,
	SignOutRegular,
	TranslateRegular,
} from '@fluentui/react-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { logout } from './api/AuthApi';
import LoginDialog from './components/auth/LoginDialog';
import RegisterDialog from './components/auth/RegisterDialog';
import { useAuth } from './components/useAuth';
import { useDialog } from './components/useDialog';
import logoDiscord from './images/Discord-Logo-White.svg';
import logoTwitter from './images/Twitter-Logo-White.svg';

const SideNav = (): React.ReactElement => {
	const { t } = useTranslation();

	const [isSideNavOpenOnMobile, setIsSideNavOpenOnMobile] =
		React.useState(false);

	const toggleOpenOnMobile = (): void =>
		setIsSideNavOpenOnMobile(!isSideNavOpenOnMobile);

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const auth = useAuth();

	const loginDialog = useDialog();
	const registerDialog = useDialog();

	const sideNav = React.useMemo(
		(): EuiSideNavItemType<any>[] => [
			{
				name: t('shared.content'),
				id: htmlIdGenerator()(),
				items: [
					{
						icon: <EuiIcon type={TranslateRegular} />,
						name: t('shared.words'),
						id: htmlIdGenerator()(),
						href: '/translations',
						onClick: (e): void => {
							e.preventDefault();
							navigate('/translations');
						},
						isSelected:
							pathname.split('/')[1] ===
							'translations' /* OPTIMIZE */,
					},
					{
						icon: <EuiIcon type={MusicNote2Regular} />,
						name: t('shared.quotes'),
						id: htmlIdGenerator()(),
						href: '/quotes',
						onClick: (e): void => {
							e.preventDefault();
							navigate('/quotes');
						},
						isSelected:
							pathname.split('/')[1] === 'quotes' /* OPTIMIZE */,
					},
					{
						icon: <EuiIcon type={CalligraphyPenRegular} />,
						name: t('shared.artists'),
						id: htmlIdGenerator()(),
						href: '/artists',
						onClick: (e): void => {
							e.preventDefault();
							navigate('/artists');
						},
						isSelected:
							pathname.split('/')[1] === 'artists' /* OPTIMIZE */,
					},
					{
						icon: <EuiIcon type={PersonRegular} />,
						name: t('shared.users'),
						id: htmlIdGenerator()(),
						href: '/users',
						onClick: (e): void => {
							e.preventDefault();
							navigate('/users');
						},
						isSelected:
							pathname.split('/')[1] === 'users' /* OPTIMIZE */,
					},
				],
			},
			{
				name: t('shared.account'),
				id: htmlIdGenerator()(),
				items: auth.isAuthenticated
					? [
							{
								icon: <EuiIcon type={SettingsRegular} />,
								name: t('users.settings'),
								id: htmlIdGenerator()(),
								href: '/settings',
								onClick: (e): void => {
									e.preventDefault();
									navigate('/settings');
								},
								isSelected:
									pathname.split('/')[1] ===
									'settings' /* OPTIMIZE */,
							},
							{
								icon: <EuiIcon type={SignOutRegular} />,
								name: t('auth.logOut'),
								id: htmlIdGenerator()(),
								onClick: async (): Promise<void> => {
									await logout();

									auth.setUser(undefined);

									localStorage.removeItem('isAuthenticated');

									navigate('/');
								},
							},
					  ]
					: [
							{
								icon: <EuiIcon type="" />,
								name: t('auth.logIn'),
								id: htmlIdGenerator()(),
								onClick: loginDialog.show,
							},
							{
								icon: <EuiIcon type={PersonAddRegular} />,
								name: t('auth.register'),
								id: htmlIdGenerator()(),
								onClick: registerDialog.show,
							},
					  ],
			},
			{
				name: t('shared.community'),
				id: htmlIdGenerator()(),
				items: [
					{
						icon: <EuiIcon type="logoGithub" />,
						name: 'GitHub',
						id: htmlIdGenerator()(),
						href: 'https://github.com/ycanardeau/yamatouta',
						target: '_blank',
					},
					{
						icon: <EuiIcon type={logoDiscord} />,
						name: 'Discord',
						id: htmlIdGenerator()(),
						href: 'https://discord.gg/fEzJdbKnam',
						target: '_blank',
					},
					{
						icon: <EuiIcon type={logoTwitter} />,
						name: 'Twitter',
						id: htmlIdGenerator()(),
						href: 'https://twitter.com/inishienomanabi',
						target: '_blank',
					},
				],
			},
		],
		[t, navigate, pathname, auth, loginDialog, registerDialog],
	);

	return (
		<>
			<EuiSideNav
				toggleOpenOnMobile={toggleOpenOnMobile}
				isOpenOnMobile={isSideNavOpenOnMobile}
				items={sideNav}
			/>

			{loginDialog.visible && (
				<LoginDialog
					onClose={loginDialog.close}
					onSuccess={(user): void => {
						auth.setUser(user);

						localStorage.setItem('isAuthenticated', 'true');

						navigate('/');
					}}
				/>
			)}

			{registerDialog.visible && (
				<RegisterDialog
					onClose={registerDialog.close}
					onSuccess={(): void => {
						// TODO
					}}
				/>
			)}
		</>
	);
};

export default SideNav;