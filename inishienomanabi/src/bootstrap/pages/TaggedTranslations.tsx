import Pagination from '@/bootstrap/Pagination';
import TranslationTable from '@/bootstrap/TranslationTable';
import { PageCount, TagList, taggedUrl } from '@/bootstrap/parts';
import { listRelatedTags, listTranslationsByTag } from '@/data/database';
import { useAsync, usePagination, useTitle } from '@/shared/hooks';
import React from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';

// views/translations/tagged.php
const TaggedTranslations = (): React.ReactElement => {
	const tagNames = (useParams().tagName ?? '')
		.replace(/　/g, ' ')
		.trim()
		.split(' ');
	const tagName = tagNames[0];
	const [searchParams] = useSearchParams();
	const sort = searchParams.get('sort') === 'ojp' ? 'ojp' : 'ja';
	const { page, pageSize } = usePagination();

	useTitle(
		page > 1
			? `${tagName}に関するやまとことばの${page}ページ目`
			: `${tagName}に関するやまとことば`,
	);

	const data = useAsync(async () => {
		const result = await listTranslationsByTag(
			tagName,
			sort,
			page,
			pageSize,
		);
		return {
			result,
			relatedTags: await listRelatedTags(result.items, tagName),
		};
	}, [tagName, sort, page, pageSize]);

	// Only one tag at a time, as on inishienomanabi.net.
	if (tagNames.length > 1)
		return <Navigate to={taggedUrl(tagName)} replace />;

	return (
		<>
			<div className="row">
				<div className="col-sm-12">
					<ol className="breadcrumb">
						<li>
							<Link to="/tags">タグ</Link>
						</li>
					</ol>
				</div>
			</div>
			<div className="row">
				<div className="col-sm-9">
					<h2>
						{tagName}に関するやまとことば{' '}
						<PageCount
							totalCount={data?.result.totalCount}
							page={page}
						/>
					</h2>
					{data && data.result.totalCount > 0 && (
						<>
							<TranslationTable
								translations={data.result.items}
								sort={sort}
							/>
							<div className="text-center">
								<Pagination
									page={page}
									pageSize={pageSize}
									totalCount={data.result.totalCount}
								/>
							</div>
						</>
					)}
				</div>
				<div className="col-sm-3">
					<h2>関連タグ</h2>
					{data &&
						(data.relatedTags.length > 0 ? (
							<TagList tags={data.relatedTags} />
						) : (
							<div>関連タグはありません。</div>
						))}
					<Link to="/tags">すべてのタグを見る</Link>
				</div>
			</div>
		</>
	);
};

export default TaggedTranslations;
