import {
	EuiFieldSearch,
	EuiFlexGroup,
	EuiFlexItem,
	EuiFormControlLayout,
	EuiFormLabel,
	EuiSelect,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import { DebounceInput } from 'react-debounce-input';
import { useTranslation } from 'react-i18next';

import { QuoteSortRule } from '../../models/quotes/QuoteSortRule';
import { QuoteType } from '../../models/quotes/QuoteType';
import { QuoteSearchStore } from '../../stores/quotes/QuoteSearchStore';

interface QuoteSearchOptionsProps {
	store: QuoteSearchStore;
}

export const QuoteSearchOptions = observer(
	({ store }: QuoteSearchOptionsProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<EuiFlexGroup gutterSize="m">
				<EuiFlexItem>
					<DebounceInput
						compressed
						fullWidth
						element={EuiFieldSearch as any}
						debounceTimeout={300}
						placeholder={t('quotes.search')}
						value={store.query}
						onChange={(e): void => store.setQuery(e.target.value)}
					/>
				</EuiFlexItem>

				<EuiFlexItem grow={false}>
					<EuiFormControlLayout
						compressed
						fullWidth
						prepend={
							<EuiFormLabel htmlFor="quoteType">
								{t('quotes.quoteType')}
							</EuiFormLabel>
						}
					>
						<EuiSelect
							compressed
							id="quoteType"
							options={[
								{
									value: '',
									text: t('shared.all'),
								},
								...Object.values(QuoteType).map((value) => ({
									value: value,
									text: t(`quoteTypeNames.${value}`),
								})),
							]}
							value={store.quoteType}
							onChange={(e): void =>
								store.setQuoteType(e.target.value as QuoteType)
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
							options={Object.values(QuoteSortRule).map(
								(value) => ({
									value: value,
									text: t(`quoteSortRuleNames.${value}`),
								}),
							)}
							value={store.sort}
							onChange={(e): void =>
								store.setSort(e.target.value as QuoteSortRule)
							}
						/>
					</EuiFormControlLayout>
				</EuiFlexItem>
			</EuiFlexGroup>
		);
	},
);
