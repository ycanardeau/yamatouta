import { TranslationSortRule } from '@/models/translations/TranslationSortRule';
import { WordCategory } from '@/models/translations/WordCategory';
import { TranslationSearchStore } from '@/stores/translations/TranslationSearchStore';
import {
	EuiFieldSearch,
	EuiFlexGroup,
	EuiFlexItem,
	EuiFormControlLayout,
	EuiFormLabel,
	EuiSelect,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface TranslationSearchOptionsProps {
	store: TranslationSearchStore;
}

export const TranslationSearchOptions = observer(
	({ store }: TranslationSearchOptionsProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<EuiFlexGroup gutterSize="m">
				<EuiFlexItem>
					<EuiFieldSearch
						compressed
						fullWidth
						placeholder={t('translations.search')}
						value={store.query}
						onChange={(e): void => store.setQuery(e.target.value)}
						onSearch={store.submit}
					/>
				</EuiFlexItem>

				<EuiFlexItem grow={false}>
					<EuiFormControlLayout
						compressed
						fullWidth
						prepend={
							<EuiFormLabel htmlFor="category">
								{t('translations.category')}
							</EuiFormLabel>
						}
					>
						<EuiSelect
							compressed
							id="category"
							options={[
								{
									value: '',
									text: t('shared.all'),
								},
								...Object.values(WordCategory).map((value) => ({
									value: value,
									text: t(`wordCategoryNames.${value}`),
								})),
							]}
							value={store.category}
							onChange={(e): void =>
								store.setCategory(
									e.target.value as WordCategory,
								)
							}
						/>
					</EuiFormControlLayout>
				</EuiFlexItem>

				<EuiFlexItem grow={false}>
					<EuiFormControlLayout
						compressed
						fullWidth
						prepend={
							<EuiFormLabel htmlFor="sort">
								{t('shared.sortBy')}
							</EuiFormLabel>
						}
					>
						<EuiSelect
							compressed
							id="sort"
							options={Object.values(TranslationSortRule).map(
								(value) => ({
									value: value,
									text: t(
										`translationSortRuleNames.${value}`,
									),
								}),
							)}
							value={store.sort}
							onChange={(e): void =>
								store.setSort(
									e.target.value as TranslationSortRule,
								)
							}
						/>
					</EuiFormControlLayout>
				</EuiFlexItem>
			</EuiFlexGroup>
		);
	},
);
