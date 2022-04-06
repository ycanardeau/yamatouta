import { EuiCommentList } from '@elastic/eui';
import React from 'react';

import QuoteComment from '../../components/quotes/QuoteComment';
import { IQuoteObject } from '../../dto/quotes/IQuoteObject';

interface QuoteBasicInfoProps {
	quote: IQuoteObject;
}

const QuoteBasicInfo = ({ quote }: QuoteBasicInfoProps): React.ReactElement => {
	return (
		<EuiCommentList>
			<QuoteComment quote={quote} />
		</EuiCommentList>
	);
};

export default QuoteBasicInfo;
