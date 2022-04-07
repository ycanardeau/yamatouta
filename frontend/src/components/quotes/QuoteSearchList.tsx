import { EuiCommentList } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { QuoteSearchStore } from '../../stores/quotes/QuoteSearchStore';
import Pagination from '../Pagination';
import QuoteComment from './QuoteComment';

interface QuoteSearchListProps {
	store: QuoteSearchStore;
}

const QuoteSearchList = observer(
	({ store }: QuoteSearchListProps): React.ReactElement => {
		return (
			<>
				{store.quotes.map((quote) => (
					<EuiCommentList key={quote.id}>
						<QuoteComment store={store} quote={quote} />
					</EuiCommentList>
				))}

				<Pagination store={store.paginationStore} />
			</>
		);
	},
);

export default QuoteSearchList;
