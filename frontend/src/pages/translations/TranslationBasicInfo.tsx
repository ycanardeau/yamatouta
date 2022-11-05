import { Link } from '@/components/Link';
import { WebLinkDescriptionList } from '@/components/WebLinkDescriptionList';
import { WorkLinkDescriptionList } from '@/components/WorkLinkDescriptionList';
import { TranslationDetailsObject } from '@/dto/TranslationDetailsObject';
import { TranslationSortRule } from '@/models/translations/TranslationSortRule';
import {
	EuiDescriptionList,
	EuiDescriptionListDescription,
	EuiDescriptionListTitle,
} from '@elastic/eui';
import qs from 'qs';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface TranslationBasicInfoProps {
	translation: TranslationDetailsObject;
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

					{translation.sources.length > 0 && (
						<WorkLinkDescriptionList
							title={t('translations.sources')}
							workLinks={translation.sources}
						/>
					)}

					{translation.webLinks.length > 0 && (
						<WebLinkDescriptionList
							webLinks={translation.webLinks}
						/>
					)}
				</EuiDescriptionList>
			</div>
		</>
	);
};

export default TranslationBasicInfo;
