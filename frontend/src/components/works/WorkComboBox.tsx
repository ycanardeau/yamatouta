import { EuiComboBox, EuiComboBoxOptionOption } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { listWorks } from '../../api/WorkApi';
import { IWorkObject } from '../../dto/IWorkObject';
import { BasicEntryLinkStore } from '../../stores/BasicEntryLinkStore';

interface WorkComboBoxProps {
	store: BasicEntryLinkStore<IWorkObject>;
}

const WorkComboBox = observer(
	({ store }: WorkComboBoxProps): React.ReactElement => {
		const { t } = useTranslation();

		const [options, setOptions] = React.useState<EuiComboBoxOptionOption[]>(
			[],
		);

		const handleSearchChange = React.useCallback(
			async (searchValue: string): Promise<void> => {
				const works = await listWorks({
					pagination: {
						offset: 0,
						limit: 20,
						getTotalCount: false,
					},
					query: searchValue,
				});

				setOptions(
					works.items.map((work) => ({
						key: work.id.toString(),
						label: work.name,
					})),
				);
			},
			[],
		);

		React.useEffect(() => {
			handleSearchChange('');
		}, [handleSearchChange]);

		return (
			<EuiComboBox
				compressed
				placeholder={t('shared.selectWork')}
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

export default WorkComboBox;
