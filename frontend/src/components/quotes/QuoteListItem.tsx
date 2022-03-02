import { Avatar, Card, CardHeader } from '@mui/material';
import React from 'react';

import { IQuoteObject } from '../../dto/quotes/IQuoteObject';
import AuthorLink from '../AuthorLink';

interface QuoteListItemProps {
	quote: IQuoteObject;
}

const QuoteListItem = React.memo(
	({ quote }: QuoteListItemProps): React.ReactElement => {
		return (
			<Card>
				<CardHeader
					avatar={
						<AuthorLink author={quote.author}>
							<Avatar
								alt={quote.author.name}
								src={quote.author.avatarUrl}
							/>
						</AuthorLink>
					}
					/*action={
						<IconButton>
							<MoreHorizIcon />
						</IconButton>
					}*/
					title={
						<AuthorLink author={quote.author}>
							{quote.author.name}
						</AuthorLink>
					}
					subheader={quote.phrases.join('')}
				/>
			</Card>
		);
	},
);

export default QuoteListItem;
