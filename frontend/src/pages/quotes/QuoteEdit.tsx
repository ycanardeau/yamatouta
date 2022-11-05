import { QuoteEditForm } from '@/components/quotes/QuoteEditForm';
import { QuotePage } from '@/components/quotes/QuotePage';
import { useQuoteDetails } from '@/components/quotes/useQuoteDetails';
import { useYamatoutaTitle } from '@/components/useYamatoutaTitle';
import { QuoteEditDto } from '@/dto/QuoteEditDto';
import React from 'react';

interface LayoutProps {
	quote: QuoteEditDto;
}

const Layout = ({ quote }: LayoutProps): React.ReactElement => {
	const title = quote.plainText.replaceAll('\n', '');

	useYamatoutaTitle(title, true);

	return (
		<QuotePage quote={quote} pageHeaderProps={{ pageTitle: title }}>
			<QuoteEditForm quote={quote} />
		</QuotePage>
	);
};

const QuoteEdit = (): React.ReactElement | null => {
	const [quote] = useQuoteDetails(
		React.useCallback((quote) => quote as QuoteEditDto, []),
	);

	return quote ? <Layout quote={quote} /> : null;
};

export default QuoteEdit;
