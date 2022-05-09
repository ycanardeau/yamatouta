import { EuiComboBox, EuiComboBoxOptionOption } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { linkApi } from '../api/linkApi';
import { ILinkTypeObject } from '../dto/ILinkTypeObject';
import { EntryType } from '../models/EntryType';
import { BasicEntryLinkStore } from '../stores/BasicEntryLinkStore';

interface LinkTypeComboBoxProps {
	store: BasicEntryLinkStore<ILinkTypeObject>;
	entryType: EntryType;
	relatedEntryType: EntryType;
}

const LinkTypeComboBox = observer(
	({
		store,
		entryType,
		relatedEntryType,
	}: LinkTypeComboBoxProps): React.ReactElement => {
		const [options, setOptions] = React.useState<EuiComboBoxOptionOption[]>(
			[],
		);

		const handleSearchChange = React.useCallback(
			async (searchValue: string): Promise<void> => {
				const linkTypes = await linkApi.listTypes({
					entryType: entryType,
					relatedEntryType: relatedEntryType,
				});

				setOptions(
					linkTypes.items.map((linkType) => ({
						key: linkType.id.toString(),
						label: linkType.name,
					})),
				);
			},
			[entryType, relatedEntryType],
		);

		React.useEffect(() => {
			handleSearchChange('');
		}, [handleSearchChange]);

		return (
			<EuiComboBox
				compressed
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

export default LinkTypeComboBox;
