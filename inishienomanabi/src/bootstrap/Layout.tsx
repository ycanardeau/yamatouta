import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Dropdown = ({
	label,
	children,
}: {
	label: React.ReactNode;
	children: React.ReactNode;
}): React.ReactElement => {
	const [open, setOpen] = React.useState(false);
	const ref = React.useRef<HTMLLIElement>(null);

	React.useEffect(() => {
		if (!open) return;
		const close = (e: MouseEvent): void => {
			if (!ref.current?.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener('click', close);
		return () => document.removeEventListener('click', close);
	}, [open]);

	return (
		<li ref={ref} className={`dropdown${open ? ' open' : ''}`}>
			<a
				href="#"
				className="dropdown-toggle"
				onClick={(e): void => {
					e.preventDefault();
					setOpen(!open);
				}}
			>
				{label} <span className="caret"></span>
			</a>
			<ul
				className="dropdown-menu"
				role="menu"
				onClick={(): void => setOpen(false)}
			>
				{children}
			</ul>
		</li>
	);
};

const Layout = (): React.ReactElement => {
	const [collapsed, setCollapsed] = React.useState(true);

	return (
		<div className="container">
			<div
				className="navbar navbar-inverse navbar-fixed-top"
				role="navigation"
			>
				<div className="container">
					<div className="navbar-header">
						<button
							type="button"
							className={`navbar-toggle${
								collapsed ? ' collapsed' : ''
							}`}
							onClick={(): void => setCollapsed(!collapsed)}
						>
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<Link to="/" className="navbar-brand">
							いにしえのまなび
						</Link>
					</div>
					<div
						className={`navbar-collapse collapse${
							collapsed ? '' : ' in'
						}`}
					>
						<ul className="nav navbar-nav">
							<li>
								<Link to="/translations/unverified">
									<span className="glyphicon glyphicon-ok"></span>{' '}
									レビュー
								</Link>
							</li>
							<Dropdown label="メニュー">
								<li>
									<Link to="/search?random-select">
										ランダム表示
									</Link>
								</li>
								<li className="divider"></li>
								<li>
									<Link to="/translations">すべての翻訳</Link>
								</li>
								<li>
									<Link to="/tags">タグ</Link>
								</li>
								<li className="divider"></li>
								<li>
									<Link to="/users">ユーザー</Link>
								</li>
							</Dropdown>
						</ul>
						<ul className="nav navbar-nav navbar-right">
							<li>
								<Link to="/help">使い方</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div className="alert alert-info" role="alert">
				<span className="glyphicon glyphicon-info-sign"></span>{' '}
				新しいサービス{' '}
				<a
					href="https://yamatouta.net"
					target="_blank"
					rel="noreferrer"
					className="alert-link"
				>
					やまとうた
				</a>{' '}
				を試す
			</div>
			<div className="clearfix">
				<div className="text-center">
					<form
						action="/search"
						method="get"
						className="form-inline search-form"
						role="form"
					>
						<div className="form-group">
							<div className="input-group">
								<input
									type="text"
									name="q"
									placeholder="キーワード"
									size={40}
									className="form-control input-sm"
								/>
								<span className="input-group-btn">
									<button
										type="submit"
										className="btn btn-warning btn-sm"
									>
										<span className="glyphicon glyphicon-search"></span>{' '}
										検索
									</button>
								</span>
							</div>
						</div>{' '}
						<div className="form-group">
							<Link
								to="/search?random-select"
								className="btn btn-default btn-sm"
								role="button"
							>
								ランダム表示
							</Link>
						</div>
					</form>
				</div>
			</div>
			<Outlet />
			<hr />
			<div className="footer">
				<p>
					Copyright &copy;{' '}
					<a
						href="https://twitter.com/AigamoDskYuta"
						target="_blank"
						rel="noreferrer"
					>
						Aigamo
					</a>{' '}
					2015-{new Date().getFullYear()}
				</p>
			</div>
		</div>
	);
};

export default Layout;
