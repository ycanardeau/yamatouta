import { Tag, User, profileImageUrl } from '@/data/database';
import { japaneseCaption, yamatokotobaCaption } from '@/shared/constants';
import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

// `2015-02-14 00:53:51` as `2015-02-14 00:53`, like date('Y-m-d H:i').
export const formatDate = (date: string | null): string =>
	date?.slice(0, 16) ?? '';

export const searchUrl = (q: string): string =>
	`/search?${new URLSearchParams({ q })}`;

export const taggedUrl = (tagName: string): string =>
	`/translations/tagged/${encodeURIComponent(tagName)}`;

export const profileUrl = (user: User): string =>
	`/users/${encodeURIComponent(user.username)}/profile`;

// views/nav.php
export const SideNav = ({
	navs,
	active,
}: {
	navs: [label: string, to: string][];
	active: string;
}): React.ReactElement => (
	<ul className="nav nav-pills nav-stacked">
		{navs.map(([label, to]) => (
			<li key={label} className={label === active ? 'active' : undefined}>
				<Link to={to}>{label}</Link>
			</li>
		))}
	</ul>
);

// views/translations/reviewNav.php
export const ReviewNav = ({
	active,
}: {
	active: string;
}): React.ReactElement => (
	<SideNav
		navs={[
			['未検証の翻訳', '/translations/unverified'],
			['再開された翻訳', '/translations/reopened'],
		]}
		active={active}
	/>
);

// views/users/badge.php
export const UserBadge = ({
	user,
}: {
	user: User;
}): React.ReactElement | null =>
	user.role === 'Administrator' ? (
		<span className="label label-danger">管理者</span>
	) : user.role === 'Advanced' ? (
		<span className="label label-warning">上級ユーザー</span>
	) : user.role === 'Intermediate' ? (
		<span className="label label-primary">中級ユーザー</span>
	) : null;

export const ProfileImage = ({
	user,
	size,
	className,
}: {
	user: User;
	size: number;
	className?: string;
}): React.ReactElement => (
	<img
		src={profileImageUrl(user)}
		className={className}
		width={size}
		height={size}
		alt=""
	/>
);

// views/translations/tags.php
export const TagList = ({ tags }: { tags: Tag[] }): React.ReactElement => (
	<ul className="list-unstyled">
		{tags.map((tag) => (
			<li key={tag.name}>
				<Link to={taggedUrl(tag.name)} className="label label-default">
					{tag.name}
				</Link>{' '}
				<small>x {tag.count}</small>
			</li>
		))}
	</ul>
);

// A link that sorts the current page, as in the headings of the tables.
export const SortLink = ({
	sortKey,
	sort,
	children,
}: {
	sortKey: string;
	sort: string;
	children: React.ReactNode;
}): React.ReactElement => {
	const { pathname } = useLocation();

	return (
		<div className="dropup">
			<Link
				to={`${pathname}?${new URLSearchParams({ sort: sortKey })}`}
				className="text-default"
			>
				<strong>{children}</strong>
				{sort === sortKey && (
					<>
						{' '}
						<span className="caret"></span>
					</>
				)}
			</Link>
		</div>
	);
};

// The heading of the japanese and yamatokotoba columns.
export const EntryHeading = (): React.ReactElement => (
	<div className="row">
		<div className="col-sm-6">
			<img src="/images/flag_of_japan.png" alt="" />{' '}
			<strong>{japaneseCaption}</strong>
		</div>
		<div className="col-sm-6">
			<img src="/images/flag_of_yamato.png" alt="" />{' '}
			<strong>{yamatokotobaCaption}</strong>
		</div>
	</div>
);

interface Entry {
	japanese: string;
	reading: string;
	yamatokotoba: string;
	category: string;
	tags: string[];
}

// The japanese and yamatokotoba columns of the review, revision and user
// tables. Words link to the search unless `plain` is set.
export const EntryColumns = ({
	entry,
	plain = false,
}: {
	entry: Entry;
	plain?: boolean;
}): React.ReactElement => {
	const [searchParams] = useSearchParams();
	const pageSize = searchParams.get('pagesize');

	const word = (q: string): React.ReactNode =>
		plain ? (
			q
		) : (
			<Link
				to={`/search?${new URLSearchParams({
					q,
					...(pageSize && { pagesize: pageSize }),
				})}`}
				className="text-default"
			>
				{q}
			</Link>
		);

	if (!entry.japanese && !entry.reading && !entry.yamatokotoba) {
		return (
			<div className="row">
				<div className="col-sm-6">
					<div className="text-danger">[削除]</div>
				</div>
				<div className="col-sm-6">
					<div className="text-danger">[削除]</div>
				</div>
			</div>
		);
	}

	return (
		<div className="row">
			<div className="col-sm-6">
				<div className="clearfix">
					{word(entry.japanese)}
					{entry.reading && <small>【{entry.reading}】</small>}{' '}
					{entry.category && <small>{`{${entry.category}}`}</small>}
				</div>
			</div>
			<div className="col-sm-6">
				<div className="clearfix">
					{plain
						? entry.yamatokotoba
						: entry.yamatokotoba
								.split(' ')
								.map((value, index) => (
									<React.Fragment key={index}>
										{word(value)}{' '}
									</React.Fragment>
								))}
					{entry.tags.length > 0 && (
						<div className="pull-right">
							{entry.tags.map((tag) => (
								<React.Fragment key={tag}>
									{plain ? (
										<span className="label label-default">
											{tag}
										</span>
									) : (
										<Link
											to={taggedUrl(tag)}
											className="label label-default"
										>
											{tag}
										</Link>
									)}{' '}
								</React.Fragment>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

// The `○件中○ページ目` after page headings.
export const PageCount = ({
	totalCount,
	page,
}: {
	totalCount?: number;
	page: number;
}): React.ReactElement => (
	<small>
		{totalCount === undefined ? '…' : `${totalCount}件中${page}ページ目`}
	</small>
);
