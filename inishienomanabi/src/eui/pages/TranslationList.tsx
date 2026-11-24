import { listTranslations } from '@/data/database';
import TranslationTable from '@/eui/TranslationTable';
import { useAsync, usePagination, useTitle } from '@/shared/hooks';
import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

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
		<>
			<EuiPageHeader
				pageTitle="すべての翻訳"
				description={
					result
						? `${result.totalCount.toLocaleString()}件`
						: undefined
				}
			/>
			<EuiSpacer />
			{result && (
				<TranslationTable
					translations={result}
					page={page}
					pageSize={pageSize}
					sort={sort}
				/>
			)}
		</>
	);
};

export default TranslationList;
