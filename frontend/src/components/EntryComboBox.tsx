import { EuiComboBox, EuiComboBoxOptionOption } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { ISearchResultObject } from '../dto/ISearchResultObject';
import { IEntryWithIdAndName } from '../models/IEntryWithIdAndName';
import { BasicEntryLinkStore } from '../stores/BasicEntryLinkStore';

interface EntryComboBoxProps<T extends IEntryWithIdAndName> {
	store: BasicEntryLinkStore<T>;
	placeholder?: string;
	onSearchChange: (searchValue: string) => Promise<ISearchResultObject<T>>;
}

export const EntryComboBox = observer(
	<T extends IEntryWithIdAndName>({
		store,
		placeholder,
		onSearchChange,
	}: EntryComboBoxProps<T>): React.ReactElement => {
		const [options, setOptions] = React.useState<EuiComboBoxOptionOption[]>(
			[],
		);

		const handleSearchChange = React.useCallback(
			async (searchValue: string): Promise<void> => {
				const entries = await onSearchChange(searchValue);

				setOptions(
					entries.items.map((entry) => ({
						key: entry.id.toString(),
						label: entry.name,
					})),
				);
			},
			[onSearchChange],
		);

		React.useEffect(() => {
			handleSearchChange('');
		}, [handleSearchChange]);

		return (
			<EuiComboBox
				compressed
				placeholder={placeholder}
				singleSelection={{ asPlainText: true }}
				options={options}
				selectedOptions={
					store.entry
						? [
								{
									key: store.entry.id.toString(),
									label: store.entry.name,
								},
						  ]
						: []
				}
				onChange={async (selectedOptions): Promise<void> => {
					await store.loadEntryById(Number(selectedOptions[0]?.key));
				}}
				onSearchChange={handleSearchChange}
				fullWidth
			/>
		);
	},
);
