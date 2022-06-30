import {
	EuiIcon,
	EuiSideNav,
	EuiSideNavItemType,
	htmlIdGenerator,
} from '@elastic/eui';
import {
	BookRegular,
	CalligraphyPenRegular,
	ContentSettingsRegular,
	MusicNote2Regular,
	NumberSymbolRegular,
	PersonAddRegular,
	PersonArrowLeftRegular,
	PersonRegular,
	SettingsRegular,
	SignOutRegular,
	TranslateRegular,
} from '@fluentui/react-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { authApi } from './api/authApi';
import { LoginDialog } from './components/auth/LoginDialog';
import { RegisterDialog } from './components/auth/RegisterDialog';
import { useAuth } from './components/useAuth';
import { useDialog } from './components/useDialog';
import config from './config';
import logoDiscord from './images/Discord-Logo-White.svg';
import logoTwitter from './images/Twitter-Logo-White.svg';
import { UserGroup } from './models/users/UserGroup';

const SideNav = (): React.ReactElement => {
	const { t } = useTranslation();

	const [isSideNavOpenOnMobile, setIsSideNavOpenOnMobile] =
		React.useState(false);

	const toggleOpenOnMobile = (): void =>
		setIsSideNavOpenOnMobile(!isSideNavOpenOnMobile);

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const tab = pathname.split('/')[1];

	const auth = useAuth();

	const loginDialog = useDialog();
	const registerDialog = useDialog();

	const sideNav = React.useMemo(
		(): EuiSideNavItemType<any>[] => [
			{
				name: t('shared.content'),
				id: htmlIdGenerator()(),
				items: (
					[
						{
							icon: <EuiIcon type={TranslateRegular} />,
							name: t('shared.words'),
							id: htmlIdGenerator()(),
							href: '/translations',
							onClick: (e): void => {
								e.preventDefault();
								navigate('/translations');
							},
							isSelected: tab === 'translations',
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
							isSelected: tab === 'quotes',
						},
						{
							icon: <EuiIcon type={NumberSymbolRegular} />,
							name: t('shared.hashtags'),
							id: htmlIdGenerator()(),
							href: '/hashtags',
							onClick: (e): void => {
								e.preventDefault();
								navigate('/hashtags');
							},
							isSelected: tab === 'hashtags',
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
							isSelected: tab === 'artists',
						},
						{
							icon: <EuiIcon type={BookRegular} />,
							name: t('shared.works'),
							id: htmlIdGenerator()(),
							href: '/works',
							onClick: (e): void => {
								e.preventDefault();
								navigate('/works');
							},
							isSelected: tab === 'works',
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
							isSelected: tab === 'users',
						},
					] as EuiSideNavItemType<any>[]
				).concat(
					auth.user?.userGroup === UserGroup.Admin
						? {
								icon: <EuiIcon type={ContentSettingsRegular} />,
								name: t('shared.manage'),
								id: htmlIdGenerator()(),
								href: '/admin',
								onClick: (e): void => {
									e.preventDefault();
									navigate('/admin');
								},
								isSelected: tab === 'admin',
						  }
						: [],
				),
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
								isSelected: tab === 'settings',
							},
							{
								icon: <EuiIcon type={SignOutRegular} />,
								name: t('auth.logOut'),
								id: htmlIdGenerator()(),
								onClick: async (): Promise<void> => {
									await authApi.logout();

									auth.setUser(undefined);

									localStorage.removeItem('isAuthenticated');

									navigate('/');
								},
							},
					  ]
					: [
							{
								icon: <EuiIcon type={PersonArrowLeftRegular} />,
								name: t('auth.logIn'),
								id: htmlIdGenerator()(),
								onClick: loginDialog.show,
							},
							{
								icon: <EuiIcon type={PersonAddRegular} />,
								name: t('auth.register'),
								id: htmlIdGenerator()(),
								onClick: registerDialog.show,
								disabled: config.disableAccountCreation,
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
		[t, navigate, tab, auth, loginDialog, registerDialog],
	);

	return (
		<>
			<EuiSideNav
				heading={t('shared.navigation')}
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
