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
import { DebounceInput } from 'react-debounce-input';
import { useTranslation } from 'react-i18next';

import { WorkSortRule } from '../../models/works/WorkSortRule';
import { WorkType } from '../../models/works/WorkType';
import { WorkSearchStore } from '../../stores/works/WorkSearchStore';

interface WorkSearchOptionsProps {
	store: WorkSearchStore;
}

export const WorkSearchOptions = observer(
	({ store }: WorkSearchOptionsProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<EuiFlexGroup gutterSize="m">
				<EuiFlexItem>
					<DebounceInput
						compressed
						fullWidth
						element={EuiFieldSearch as any}
						debounceTimeout={300}
						placeholder={t('works.search')}
						value={store.query}
						onChange={(e): void => store.setQuery(e.target.value)}
					/>
				</EuiFlexItem>

				<EuiFlexItem grow={false}>
					<EuiFormControlLayout
						compressed
						fullWidth
						prepend={
							<EuiFormLabel htmlFor="workType">
								{t('works.workType')}
							</EuiFormLabel>
						}
					>
						<EuiSelect
							compressed
							id="workType"
							options={[
								{
									value: '',
									text: t('shared.all'),
								},
								...Object.values(WorkType).map((value) => ({
									value: value,
									text: t(`workTypeNames.${value}`),
								})),
							]}
							value={store.workType}
							onChange={(e): void =>
								store.setWorkType(e.target.value as WorkType)
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
							options={Object.values(WorkSortRule).map(
								(value) => ({
									value: value,
									text: t(`workSortRuleNames.${value}`),
								}),
							)}
							value={store.sort}
							onChange={(e): void =>
								store.setSort(e.target.value as WorkSortRule)
							}
						/>
					</EuiFormControlLayout>
				</EuiFlexItem>
			</EuiFlexGroup>
		);
	},
);
