import Pagination from '@/bootstrap/Pagination';
import {
	EntryColumns,
	EntryHeading,
	PageCount,
	ReviewNav,
	SortLink,
	formatDate,
} from '@/bootstrap/parts';
import { TranslationStatus, listTranslationsByStatus } from '@/data/database';
import { useAsync, usePagination, useTitle } from '@/shared/hooks';
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

// views/translations/unverified.php and reopened.php, with
// views/translations/reviewTable.php. Editing needs logging in, so the edit
// buttons are left out.
const ReviewList = ({
	status,
	title,
}: {
	status: TranslationStatus;
	title: string;
}): React.ReactElement => {
	const [searchParams] = useSearchParams();
	const sort = searchParams.get('sort') === 'vote' ? 'vote' : 'date';
	const { page, pageSize } = usePagination();

	useTitle(page > 1 ? `${title}の${page}ページ目` : title);

	const result = useAsync(
		() => listTranslationsByStatus(status, sort, page, pageSize),
		[status, sort, page, pageSize],
	);

	return (
		<div className="row">
			<div className="col-sm-9">
				<h2>
					{title}{' '}
					<PageCount totalCount={result?.totalCount} page={page} />
				</h2>
				{result &&
					(result.items.length > 0 ? (
						<>
							<div className="result result-hover result-condensed">
								<div className="result-heading">
									<div className="result-row">
										<div className="row">
											<div className="col-sm-2">
												<SortLink
													sortKey="date"
													sort={sort}
												>
													日付
												</SortLink>
											</div>
											<div className="col-sm-8">
												<EntryHeading />
											</div>
											<div className="col-sm-2">
												<SortLink
													sortKey="vote"
													sort={sort}
												>
													投票
												</SortLink>
											</div>
										</div>
									</div>
								</div>
								<div className="result-body">
									{result.items.map((translation) => (
										<div
											className="result-row"
											key={translation.id}
										>
											<div className="row">
												<div className="col-sm-2">
													<Link
														to={`/translations/${translation.id}/revisions`}
														className="text-default"
													>
														{formatDate(
															translation.activationDate,
														)}
													</Link>
												</div>
												<div className="col-sm-8">
													<EntryColumns
														entry={translation}
													/>
												</div>
												<div className="col-sm-2">
													{translation.voteCount}
												</div>
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
					) : (
						<p>{title}はありません。</p>
					))}
			</div>
			<div className="col-sm-3">
				<h2>レビュー</h2>
				<ReviewNav active={title} />
			</div>
		</div>
	);
};

export const UnverifiedTranslations = (): React.ReactElement => (
	<ReviewList status="Unverified" title="未検証の翻訳" />
);

export const ReopenedTranslations = (): React.ReactElement => (
	<ReviewList status="Reopened" title="再開された翻訳" />
);
