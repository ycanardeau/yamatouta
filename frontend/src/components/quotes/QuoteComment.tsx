import { EuiComment, EuiLink } from '@elastic/eui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { IQuoteObject } from '../../dto/quotes/IQuoteObject';
import Avatar from '../Avatar';

interface QuoteCommentProps {
	quote: IQuoteObject;
}

const QuoteComment = ({ quote }: QuoteCommentProps): React.ReactElement => {
	const quoteText = quote.phrases.join('');

	const navigate = useNavigate();

	return (
		<EuiComment
			username={
				<EuiLink
					color="text"
					href={`/artists/${quote.artist.id}`}
					onClick={(e: React.MouseEvent<HTMLAnchorElement>): void => {
						e.preventDefault();
						navigate(`/artists/${quote.artist.id}`);
					}}
					style={{ fontSize: 'inherit', fontWeight: 'inherit' }}
				>
					{quote.artist.name}
				</EuiLink>
			}
			timelineIcon={<Avatar size="l" name={quote.artist.name} />}
		>
			{quoteText}
		</EuiComment>
	);
};

export default QuoteComment;
