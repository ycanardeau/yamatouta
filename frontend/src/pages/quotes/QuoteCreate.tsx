import { QuoteEditForm } from '@/components/quotes/QuoteEditForm';
import { QuotePage } from '@/components/quotes/QuotePage';
import { useYamatoutaTitle } from '@/components/useYamatoutaTitle';
import React from 'react';
import { useTranslation } from 'react-i18next';

const QuoteCreate = (): React.ReactElement => {
	const { t, ready } = useTranslation();

	const title = t('quotes.addQuote');

	useYamatoutaTitle(title, ready);

	return (
		<QuotePage pageHeaderProps={{ pageTitle: title }}>
			<QuoteEditForm />
		</QuotePage>
	);
};

export default QuoteCreate;
