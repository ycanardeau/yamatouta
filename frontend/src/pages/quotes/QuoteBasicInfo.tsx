import {
	EuiCommentList,
	EuiDescriptionList,
	EuiDescriptionListDescription,
	EuiDescriptionListTitle,
	EuiSpacer,
} from '@elastic/eui';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { WebLinkList } from '../../components/WebLinkList';
import { QuoteComment } from '../../components/quotes/QuoteComment';
import { QuoteDetailsObject } from '../../dto/QuoteDetailsObject';

interface QuoteBasicInfoProps {
	quote: QuoteDetailsObject;
}

const QuoteBasicInfo = ({ quote }: QuoteBasicInfoProps): React.ReactElement => {
	const { t } = useTranslation();

	return (
		<>
			<div style={{ maxWidth: '400px' }}>
				<EuiDescriptionList type="column" compressed>
					<EuiDescriptionListTitle>
						{t('quotes.quoteType')}
					</EuiDescriptionListTitle>
					<EuiDescriptionListDescription>
						{t(`quoteTypeNames.${quote.quoteType}`)}
					</EuiDescriptionListDescription>

					{quote.webLinks.length > 0 && (
						<>
							<EuiDescriptionListTitle>
								{t('shared.externalLinks')}
							</EuiDescriptionListTitle>
							<EuiDescriptionListDescription>
								<WebLinkList webLinks={quote.webLinks} />
							</EuiDescriptionListDescription>
						</>
					)}
				</EuiDescriptionList>
			</div>

			<EuiSpacer size="l" />

			<EuiCommentList>
				<QuoteComment quote={quote} />
			</EuiCommentList>
		</>
	);
};

export default QuoteBasicInfo;
