import {
	EuiCommentList,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiPageHeaderProps,
	EuiSpacer,
} from '@elastic/eui';

import { IQuoteObject } from '../../dto/IQuoteObject';
import QuoteBreadcrumbs from './QuoteBreadcrumbs';

interface QuotePageProps {
	quote?: IQuoteObject;
	pageHeaderProps?: EuiPageHeaderProps;
	children?: React.ReactNode;
}

const QuotePage = ({
	quote,
	pageHeaderProps,
	children,
}: QuotePageProps): React.ReactElement => {
	return (
		<>
			<QuoteBreadcrumbs quote={quote} />
			<EuiSpacer size="xs" />
			<EuiPageHeader {...pageHeaderProps} />

			<EuiPageContent
				hasBorder={false}
				hasShadow={false}
				paddingSize="none"
				color="transparent"
				borderRadius="none"
			>
				<EuiPageContentBody>
					<EuiCommentList>{children}</EuiCommentList>
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
};

export default QuotePage;