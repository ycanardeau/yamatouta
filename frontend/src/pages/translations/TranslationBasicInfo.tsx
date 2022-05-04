import {
	EuiDescriptionList,
	EuiDescriptionListDescription,
	EuiDescriptionListTitle,
	EuiLink,
} from '@elastic/eui';
import qs from 'qs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ITranslationObject } from '../../dto/translations/ITranslationObject';
import { TranslationSortRule } from '../../models/TranslationSortRule';

interface TranslationBasicInfoProps {
	translation: ITranslationObject;
}

const TranslationBasicInfo = ({
	translation,
}: TranslationBasicInfoProps): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	return (
		<>
			<div style={{ maxWidth: '400px' }}>
				<EuiDescriptionList type="column" compressed>
					<EuiDescriptionListTitle>
						{t('translations.headword')}
					</EuiDescriptionListTitle>
					<EuiDescriptionListDescription>
						<EuiLink
							href={`/translations?${qs.stringify({
								query: translation.headword,
								sort: TranslationSortRule.HeadwordAsc,
							})}`}
							onClick={(
								e: React.MouseEvent<HTMLAnchorElement>,
							): void => {
								e.preventDefault();
								navigate(
									`/translations?${qs.stringify({
										query: translation.headword,
										sort: TranslationSortRule.HeadwordAsc,
									})}`,
								);
							}}
						>
							{translation.headword}
						</EuiLink>
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
						<EuiLink
							href={`/translations?${qs.stringify({
								query: translation.yamatokotoba,
								sort: TranslationSortRule.YamatokotobaAsc,
							})}`}
							onClick={(
								e: React.MouseEvent<HTMLAnchorElement>,
							): void => {
								e.preventDefault();
								navigate(
									`/translations?${qs.stringify({
										query: translation.yamatokotoba,
										sort: TranslationSortRule.YamatokotobaAsc,
									})}`,
								);
							}}
						>
							{translation.yamatokotoba}
						</EuiLink>
					</EuiDescriptionListDescription>

					<EuiDescriptionListTitle>
						{t('translations.category')}
					</EuiDescriptionListTitle>
					<EuiDescriptionListDescription>
						<EuiLink
							href={`/translations?${qs.stringify({
								category: translation.category,
							})}`}
							onClick={(
								e: React.MouseEvent<HTMLAnchorElement>,
							): void => {
								e.preventDefault();
								navigate(
									`/translations?${qs.stringify({
										category: translation.category,
									})}`,
								);
							}}
						>
							{t(`wordCategoryNames.${translation.category}`)}
						</EuiLink>
					</EuiDescriptionListDescription>
				</EuiDescriptionList>
			</div>
		</>
	);
};

export default TranslationBasicInfo;
