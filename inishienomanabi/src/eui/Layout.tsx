import {
	EuiCallOut,
	EuiFieldSearch,
	EuiHeader,
	EuiHeaderLink,
	EuiHeaderLinks,
	EuiHeaderLogo,
	EuiHeaderSectionItem,
	EuiPageTemplate,
	EuiSideNav,
	EuiSpacer,
} from '@elastic/eui';
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const navItems: { name: string; to: string }[] = [
	{ name: 'すべての翻訳', to: '/translations' },
	{ name: '新しく登録された翻訳', to: '/translations/newest' },
	{ name: '人気の翻訳', to: '/translations/popular' },
	{ name: '未検証の翻訳', to: '/translations/unverified' },
	{ name: '再開された翻訳', to: '/translations/reopened' },
	{ name: 'タグ', to: '/tags' },
	{ name: 'ユーザー', to: '/users' },
	{ name: '使い方', to: '/help' },
];

const Layout = (): React.ReactElement => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const go =
		(to: string) =>
		(e: React.MouseEvent): void => {
			e.preventDefault();
			navigate(to);
		};

	return (
		<>
			<EuiHeader position="fixed">
				<EuiHeaderSectionItem>
					<EuiHeaderLogo iconType="empty" href="/" onClick={go('/')}>
						いにしえのまなび
					</EuiHeaderLogo>
				</EuiHeaderSectionItem>
				<EuiHeaderSectionItem>
					<form
						onSubmit={(e): void => {
							e.preventDefault();
							const q = new FormData(e.currentTarget).get('q');
							navigate(
								`/search?${new URLSearchParams({
									q: String(q ?? ''),
								})}`,
							);
						}}
					>
						<EuiFieldSearch
							name="q"
							placeholder="キーワード"
							compressed
						/>
					</form>
				</EuiHeaderSectionItem>
				<EuiHeaderSectionItem>
					<EuiHeaderLinks>
						<EuiHeaderLink
							href="/search?random-select"
							onClick={go('/search?random-select')}
						>
							ランダム表示
						</EuiHeaderLink>
					</EuiHeaderLinks>
				</EuiHeaderSectionItem>
			</EuiHeader>
			<EuiPageTemplate panelled restrictWidth>
				<EuiPageTemplate.Sidebar sticky>
					<EuiSideNav
						items={[
							{
								id: 'menu',
								name: 'メニュー',
								items: navItems.map(({ name, to }) => ({
									id: to,
									name,
									href: to,
									onClick: go(to),
									isSelected: pathname === to,
								})),
							},
						]}
					/>
				</EuiPageTemplate.Sidebar>
				<EuiPageTemplate.Section>
					<EuiCallOut size="s" iconType="popout">
						新しいサービス{' '}
						<a
							href="https://yamatouta.net"
							target="_blank"
							rel="noreferrer"
						>
							やまとうた
						</a>{' '}
						を試す
					</EuiCallOut>
					<EuiSpacer />
					<Outlet />
				</EuiPageTemplate.Section>
			</EuiPageTemplate>
		</>
	);
};

export default Layout;
