import {
	EuiDescriptionList,
	EuiDescriptionListDescription,
	EuiDescriptionListTitle,
} from '@elastic/eui';
import qs from 'qs';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Link from '../../components/Link';
import { ITranslationObject } from '../../dto/translations/ITranslationObject';
import { TranslationSortRule } from '../../models/TranslationSortRule';

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
						<Link
							to={`/translations?${qs.stringify({
								query: translation.headword,
								sort: TranslationSortRule.HeadwordAsc,
							})}`}
						>
							{translation.headword}
						</Link>
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
						<Link
							to={`/translations?${qs.stringify({
								query: translation.yamatokotoba,
								sort: TranslationSortRule.YamatokotobaAsc,
							})}`}
						>
							{translation.yamatokotoba}
						</Link>
					</EuiDescriptionListDescription>

					<EuiDescriptionListTitle>
						{t('translations.category')}
					</EuiDescriptionListTitle>
					<EuiDescriptionListDescription>
						<Link
							to={`/translations?${qs.stringify({
								category: translation.category,
							})}`}
						>
							{t(`wordCategoryNames.${translation.category}`)}
						</Link>
					</EuiDescriptionListDescription>
				</EuiDescriptionList>
			</div>
		</>
	);
};

export default TranslationBasicInfo;
