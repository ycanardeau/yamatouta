import { IQuoteDto } from '@/dto/IQuoteDto';
import { EntryUrlMapper } from '@/models/EntryUrlMapper';
import {
	EuiBreadcrumb,
	EuiPageHeaderProps,
	EuiPageTemplate,
} from '@elastic/eui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface QuotePageProps {
	quote?: IQuoteDto;
	pageHeaderProps?: EuiPageHeaderProps;
	children?: React.ReactNode;
}

export const QuotePage = ({
	quote,
	pageHeaderProps,
	children,
}: QuotePageProps): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	return (
		<>
			<EuiPageTemplate.Header
				{...pageHeaderProps}
				restrictWidth
				breadcrumbs={([] as EuiBreadcrumb[])
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
									text: quote.plainText.replaceAll('\n', ''),
									href: EntryUrlMapper.details(quote),
									onClick: (e): void => {
										e.preventDefault();
										navigate(EntryUrlMapper.details(quote));
									},
							  }
							: [],
					)}
			/>
			<EuiPageTemplate.Section restrictWidth>
				{children}
			</EuiPageTemplate.Section>
		</>
	);
};
