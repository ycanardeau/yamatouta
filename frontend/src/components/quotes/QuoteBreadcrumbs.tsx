import { EuiBreadcrumb, EuiBreadcrumbs } from '@elastic/eui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IQuoteObject } from '../../dto/IQuoteObject';

interface QuoteBreadcrumbsProps {
	quote?: Pick<IQuoteObject, 'id' | 'text'>;
}

const QuoteBreadcrumbs = ({
	quote,
}: QuoteBreadcrumbsProps): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	const breadcrumbs = ([] as EuiBreadcrumb[])
		.concat({
			text: t('shared.quotes'),
			href: '/quotes',
			onClick: (e): void => {
				e.preventDefault();
				navigate('/quotes');
			},
		})
		.concat(
			quote
				? {
						text: quote.text.replaceAll('\n', ''),
						href: `/quotes/${quote.id}`,
						onClick: (e): void => {
							e.preventDefault();
							navigate(`/quotes/${quote.id}`);
						},
				  }
				: [],
		);

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};

export default QuoteBreadcrumbs;
