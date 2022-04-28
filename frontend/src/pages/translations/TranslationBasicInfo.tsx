import {
	EuiDescriptionList,
	EuiDescriptionListDescription,
	EuiDescriptionListTitle,
} from '@elastic/eui';
import React from 'react';
import { useTranslation } from 'react-i18next';

import WebLinkList from '../../components/WebLinkList';
import { ITranslationObject } from '../../dto/translations/ITranslationObject';

interface TranslationBasicInfoProps {
	translation: ITranslationObject;
}

const TranslationBasicInfo = ({
	translation,
}: TranslationBasicInfoProps): React.ReactElement => {
	const { t } = useTranslation();

	return (
		<>
			<div style={{ maxWidth: '400px' }}>
				<EuiDescriptionList type="column" compressed>
					<EuiDescriptionListTitle>
						{t('translations.headword')}
					</EuiDescriptionListTitle>
					<EuiDescriptionListDescription>
						{translation.headword}
					</EuiDescriptionListDescription>

					<EuiDescriptionListTitle>
						{t('translations.reading')}
					</EuiDescriptionListTitle>
					<EuiDescriptionListDescription>
						{translation.reading}
					</EuiDescriptionListDescription>

					<EuiDescriptionListTitle>
						{t('translations.yamatokotoba')}
					</EuiDescriptionListTitle>
					<EuiDescriptionListDescription>
						{translation.yamatokotoba}
					</EuiDescriptionListDescription>

					<EuiDescriptionListTitle>
						{t('translations.category')}
					</EuiDescriptionListTitle>
					<EuiDescriptionListDescription>
						{t(`wordCategoryNames.${translation.category}`)}
					</EuiDescriptionListDescription>

					{translation.webLinks.length > 0 && (
						<>
							<EuiDescriptionListTitle>
								{t('shared.externalLinks')}
							</EuiDescriptionListTitle>
							<EuiDescriptionListDescription>
								<WebLinkList webLinks={translation.webLinks} />
							</EuiDescriptionListDescription>
						</>
					)}
				</EuiDescriptionList>
			</div>
		</>
	);
};

export default TranslationBasicInfo;
