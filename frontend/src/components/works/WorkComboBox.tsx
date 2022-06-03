import React from 'react';
import { useTranslation } from 'react-i18next';

import { workApi } from '../../api/workApi';
import { ISearchResultObject } from '../../dto/ISearchResultObject';
import { IWorkObject } from '../../dto/IWorkObject';
import { BasicEntryLinkStore } from '../../stores/BasicEntryLinkStore';
import { EntryComboBox } from '../EntryComboBox';

interface WorkComboBoxProps {
	store: BasicEntryLinkStore<IWorkObject>;
}

export const WorkComboBox = ({
	store,
}: WorkComboBoxProps): React.ReactElement => {
	const { t } = useTranslation();

	const handleSearchChange = React.useCallback(
		(searchValue): Promise<ISearchResultObject<IWorkObject>> =>
			workApi.list({
				pagination: {
					offset: 0,
					limit: 20,
					getTotalCount: false,
				},
				query: searchValue,
			}),
		[],
	);

	return (
		<EntryComboBox
			store={store}
			onSearchChange={handleSearchChange}
			placeholder={t('shared.selectWork')}
		/>
	);
};
