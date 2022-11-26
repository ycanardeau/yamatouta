import { Pagination } from '@/components/Pagination';
import { QuoteComment } from '@/components/quotes/QuoteComment';
import { QuoteSearchStore } from '@/stores/quotes/QuoteSearchStore';
import { EuiCommentList, EuiProgress, EuiSpacer } from '@elastic/eui';
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
				<EuiCommentList>
					{store.quotes.map((quote) => (
						<QuoteComment
							store={store}
							quote={quote}
							key={quote.id}
						/>
					))}
				</EuiCommentList>

				<EuiSpacer size="m" />

				<Pagination store={store.pagination} />
			</>
		);
	},
);
