import Pagination from '@/bootstrap/Pagination';
import TranslationTable from '@/bootstrap/TranslationTable';
import { listTranslations } from '@/data/database';
import { useAsync, usePagination, useTitle } from '@/shared/hooks';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

// views/translations/list.php
const TranslationList = (): React.ReactElement => {
	const [searchParams] = useSearchParams();
	const sort = searchParams.get('sort') === 'ojp' ? 'ojp' : 'ja';
	const { page, pageSize } = usePagination();

	useTitle(page > 1 ? `すべての翻訳の${page}ページ目` : 'すべての翻訳');

	const result = useAsync(
		() => listTranslations(sort, page, pageSize),
		[sort, page, pageSize],
	);

	return (
		<div className="row">
			<div className="col-sm-9">
				<h2>
					すべての翻訳{' '}
					<small>
						{result
							? `${result.totalCount}件中${page}ページ目`
							: '…'}
					</small>
				</h2>
				{result &&
					(result.items.length > 0 ? (
						<>
							<TranslationTable
								translations={result.items}
								sort={sort}
							/>
							<div className="text-center">
								<Pagination
									page={page}
									pageSize={pageSize}
									totalCount={result.totalCount}
								/>
							</div>
						</>
					) : (
						<p>翻訳はありません。</p>
					))}
			</div>
			<div className="col-sm-3"></div>
		</div>
	);
};

export default TranslationList;
