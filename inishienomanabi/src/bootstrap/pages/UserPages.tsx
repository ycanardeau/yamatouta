import Pagination from '@/bootstrap/Pagination';
import NotFound from '@/bootstrap/pages/NotFound';
import {
	EntryColumns,
	EntryHeading,
	ProfileImage,
	SideNav,
	UserBadge,
	formatDate,
} from '@/bootstrap/parts';
import {
	Page,
	SuggestedEditStatus,
	TranslationStatus,
	User,
	getUserByUsername,
	listReviewsByUser,
	listTranslationsByUser,
} from '@/data/database';
import { useAsync, usePagination, useTitle } from '@/shared/hooks';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

// The breadcrumb and the side nav of views/users/*.php. Comments were hidden
// from visitors, so the comments page is left out.
const UserLayout = ({
	user,
	active,
	children,
}: {
	user: User;
	active: string;
	children: React.ReactNode;
}): React.ReactElement => {
	const base = `/users/${encodeURIComponent(user.username)}`;

	return (
		<>
			<div className="row">
				<div className="col-sm-12">
					<ol className="breadcrumb">
						<li>
							<Link to="/users">ユーザー</Link>
						</li>
					</ol>
				</div>
			</div>
			<div className="row">
				<div className="col-sm-9">{children}</div>
				<div className="col-sm-3">
					<h2>{user.name}</h2>
					<SideNav
						navs={[
							['プロフィール', `${base}/profile`],
							['翻訳', `${base}/translations`],
							['レビュー', `${base}/reviews`],
						]}
						active={active}
					/>
				</div>
			</div>
		</>
	);
};

// Loads the user of the URL, and shows the 404 page if there is none.
const useUserPage = <T,>(
	load: (user: User) => Promise<T>,
	deps: React.DependencyList,
): { user: User; data: T } | null | undefined => {
	const { username = '' } = useParams();
	return useAsync(async () => {
		const user = await getUserByUsername(username);
		return user ? { user, data: await load(user) } : null;
	}, [username, ...deps]);
};

const truncate = (text: string, width: number): string =>
	text.length > width ? `${text.slice(0, width - 2)} …` : text;

// views/users/profile.php
export const UserProfile = (): React.ReactElement | null => {
	const page = useUserPage(async () => undefined, []);

	useTitle(page ? `${page.user.name}のプロフィール` : undefined);

	if (page === undefined) return null;
	if (page === null) return <NotFound />;

	const { user } = page;

	return (
		<UserLayout user={user} active="プロフィール">
			<h2>{user.name}のプロフィール</h2>
			<ul className="media-list">
				<li className="media">
					<div className="pull-left">
						<ProfileImage
							user={user}
							size={128}
							className="media-object"
						/>
					</div>
					<div className="media-body">
						<div className="result result-condensed">
							<div className="result-body">
								<div className="result-row">
									<div className="row">
										<div className="col-sm-3">
											<strong>名前</strong>
										</div>
										<div className="col-sm-9">
											<span>{user.name}</span>{' '}
											<UserBadge user={user} />
										</div>
									</div>
								</div>
								<div className="result-row">
									<div className="row">
										<div className="col-sm-3">
											<strong>ウェブサイト</strong>
										</div>
										<div className="col-sm-9">
											{user.websiteUrl && (
												<a
													href={user.websiteUrl}
													target="_blank"
													rel="noreferrer"
												>
													{truncate(
														user.websiteUrl,
														40,
													)}
												</a>
											)}
										</div>
									</div>
								</div>
								<div className="result-row">
									<div className="row">
										<div className="col-sm-3">
											<strong>登録日</strong>
										</div>
										<div className="col-sm-9">
											{formatDate(user.creationDate)}
										</div>
									</div>
								</div>
								<div className="result-row">
									<div className="row">
										<div className="col-sm-3">
											<strong>自己紹介</strong>
										</div>
										<div
											className="col-sm-9"
											style={{ whiteSpace: 'pre-line' }}
										>
											{user.aboutMe}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</UserLayout>
	);
};

interface UserTableRow {
	id: number;
	translationId: number;
	date: string;
	entry: React.ComponentProps<typeof EntryColumns>['entry'];
	status: React.ReactElement;
}

// The tables of views/users/translations.php and reviews.php. Editing needs
// logging in, so the edit buttons are left out.
const UserTable = ({
	page,
	pageSize,
	result,
	rows,
}: {
	page: number;
	pageSize: number;
	result: Page<unknown>;
	rows: UserTableRow[];
}): React.ReactElement => (
	<>
		<div className="result result-hover result-condensed">
			<div className="result-heading">
				<div className="result-row">
					<div className="row">
						<div className="col-sm-2">
							<strong>日付</strong>
						</div>
						<div className="col-sm-8">
							<EntryHeading />
						</div>
						<div className="col-sm-2">
							<strong>状態</strong>
						</div>
					</div>
				</div>
			</div>
			<div className="result-body">
				{rows.map((row) => (
					<div className="result-row" key={row.id}>
						<div className="row">
							<div className="col-sm-2">
								<Link
									to={`/translations/${row.translationId}/revisions`}
									className="text-default"
								>
									{formatDate(row.date)}
								</Link>
							</div>
							<div className="col-sm-8">
								<EntryColumns entry={row.entry} />
							</div>
							<div className="col-sm-2">{row.status}</div>
						</div>
					</div>
				))}
			</div>
		</div>
		<div className="text-center">
			<Pagination
				page={page}
				pageSize={pageSize}
				totalCount={result.totalCount}
			/>
		</div>
	</>
);

const translationStatuses: Record<TranslationStatus, React.ReactElement> = {
	Verified: (
		<span className="text-success">
			<b>受理</b>
		</span>
	),
	Unverified: (
		<span className="text-muted">
			<b>保留</b>
		</span>
	),
	Reopened: (
		<span className="text-muted">
			<b>再開</b>
		</span>
	),
};

// views/users/translations.php
export const UserTranslations = (): React.ReactElement | null => {
	const { page, pageSize } = usePagination();
	const userPage = useUserPage(
		(user) => listTranslationsByUser(user.id, page, pageSize),
		[page, pageSize],
	);

	useTitle(userPage ? `${userPage.user.name}の翻訳` : undefined);

	if (userPage === undefined) return null;
	if (userPage === null) return <NotFound />;

	const { user, data: result } = userPage;

	return (
		<UserLayout user={user} active="翻訳">
			<h2>
				{user.name}の翻訳 ({result.totalCount}件)
			</h2>
			{result.items.length > 0 ? (
				<UserTable
					page={page}
					pageSize={pageSize}
					result={result}
					rows={result.items.map((translation) => ({
						id: translation.id,
						translationId: translation.id,
						date: translation.creationDate,
						entry: translation,
						status: translationStatuses[translation.status],
					}))}
				/>
			) : (
				<p>このユーザーの翻訳はありません。</p>
			)}
		</UserLayout>
	);
};

const suggestedEditStatuses: Record<SuggestedEditStatus, React.ReactElement> = {
	Pending: (
		<span className="text-muted">
			<b>保留</b>
		</span>
	),
	Approved: (
		<span className="text-success">
			<b>受理</b>
		</span>
	),
	'Minor Diff': (
		<span className="text-success">
			<b>小異</b>
		</span>
	),
	Rejected: (
		<span className="text-danger">
			<b>却下</b>
		</span>
	),
};

// views/users/reviews.php
export const UserReviews = (): React.ReactElement | null => {
	const { page, pageSize } = usePagination();
	const userPage = useUserPage(
		(user) => listReviewsByUser(user.id, page, pageSize),
		[page, pageSize],
	);

	useTitle(userPage ? `${userPage.user.name}のレビュー` : undefined);

	if (userPage === undefined) return null;
	if (userPage === null) return <NotFound />;

	const { user, data: result } = userPage;

	return (
		<UserLayout user={user} active="レビュー">
			<h2>
				{user.name}のレビュー ({result.totalCount}件)
			</h2>
			{result.items.length > 0 ? (
				<UserTable
					page={page}
					pageSize={pageSize}
					result={result}
					rows={result.items.map((review) => ({
						id: review.id,
						translationId: review.translationId,
						date: review.creationDate,
						entry: review,
						status: suggestedEditStatuses[review.status],
					}))}
				/>
			) : (
				<p>このユーザーのレビューはありません。</p>
			)}
		</UserLayout>
	);
};
