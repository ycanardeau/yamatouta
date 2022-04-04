import { EuiComment, EuiCommentList } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { QuoteSearchStore } from '../../stores/quotes/QuoteSearchStore';
import Avatar from '../Avatar';
import Pagination from '../Pagination';

interface QuoteSearchListProps {
	store: QuoteSearchStore;
}

const QuoteSearchList = observer(
	({ store }: QuoteSearchListProps): React.ReactElement => {
		return (
			<>
				{store.quotes.map((quote) => (
					<EuiCommentList key={quote.id}>
						<EuiComment
							username={quote.artist.name}
							timelineIcon={
								<Avatar size="l" name={quote.artist.name} />
							}
						>
							{quote.phrases.join('')}
						</EuiComment>
					</EuiCommentList>
				))}

				<Pagination store={store.paginationStore} />
			</>
		);
	},
);

export default QuoteSearchList;
