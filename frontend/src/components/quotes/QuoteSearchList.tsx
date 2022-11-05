import { Pagination } from '@/components/Pagination';
import { QuoteComment } from '@/components/quotes/QuoteComment';
import { QuoteSearchStore } from '@/stores/quotes/QuoteSearchStore';
import { EuiCommentList, EuiProgress } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';

interface QuoteSearchListProps {
	store: QuoteSearchStore;
}

export const QuoteSearchList = observer(
	({ store }: QuoteSearchListProps): React.ReactElement => {
		return store.loading ? (
			<EuiProgress size="xs" color="primary" />
		) : (
			<>
				{store.quotes.map((quote) => (
					<EuiCommentList key={quote.id}>
						<QuoteComment store={store} quote={quote} />
					</EuiCommentList>
				))}

				<Pagination store={store.pagination} />
			</>
		);
	},
);
