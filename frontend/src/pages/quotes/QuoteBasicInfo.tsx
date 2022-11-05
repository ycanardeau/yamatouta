import { WebLinkDescriptionList } from '@/components/WebLinkDescriptionList';
import { WorkLinkDescriptionList } from '@/components/WorkLinkDescriptionList';
import { QuoteComment } from '@/components/quotes/QuoteComment';
import { QuoteDetailsObject } from '@/dto/QuoteDetailsObject';
import {
	EuiCommentList,
	EuiDescriptionList,
	EuiDescriptionListDescription,
	EuiDescriptionListTitle,
	EuiSpacer,
} from '@elastic/eui';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface QuoteBasicInfoProps {
	quote: QuoteDetailsObject;
}

const QuoteBasicInfo = ({ quote }: QuoteBasicInfoProps): React.ReactElement => {
	const { t } = useTranslation();

	return (
		<>
			<EuiCommentList>
				<QuoteComment quote={quote} />
			</EuiCommentList>

			<EuiSpacer size="l" />

			<div style={{ maxWidth: '400px' }}>
				<EuiDescriptionList type="column" compressed>
					<EuiDescriptionListTitle>
						{t('quotes.quoteType')}
					</EuiDescriptionListTitle>
					<EuiDescriptionListDescription>
						{t(`quoteTypeNames.${quote.quoteType}`)}
					</EuiDescriptionListDescription>

					{quote.sources.length > 0 && (
						<WorkLinkDescriptionList
							title={t('quotes.sources')}
							workLinks={quote.sources}
						/>
					)}

					{quote.webLinks.length > 0 && (
						<WebLinkDescriptionList webLinks={quote.webLinks} />
					)}
				</EuiDescriptionList>
			</div>
		</>
	);
};

export default QuoteBasicInfo;
