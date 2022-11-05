import { workApi } from '@/api/workApi';
import { EntryComboBox } from '@/components/EntryComboBox';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { IWorkDto } from '@/dto/IWorkDto';
import { BasicEntryLinkStore } from '@/stores/BasicEntryLinkStore';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface WorkComboBoxProps {
	store: BasicEntryLinkStore<IWorkDto>;
}

export const WorkComboBox = ({
	store,
}: WorkComboBoxProps): React.ReactElement => {
	const { t } = useTranslation();

	const handleSearchChange = React.useCallback(
		(searchValue: string): Promise<ISearchResultDto<IWorkDto>> =>
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
