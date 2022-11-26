import { IQuoteDto } from '@/dto/IQuoteDto';
import { EntryUrlMapper } from '@/models/EntryUrlMapper';
import {
	EuiBreadcrumb,
	EuiPageContent_Deprecated as EuiPageContent,
	EuiPageContentBody_Deprecated as EuiPageContentBody,
	EuiPageHeader,
	EuiPageHeaderProps,
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
			<EuiPageHeader
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

			<EuiPageContent
				hasBorder={false}
				hasShadow={false}
				paddingSize="none"
				color="transparent"
				borderRadius="none"
			>
				<EuiPageContentBody restrictWidth>
					{children}
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
};
