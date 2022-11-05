import { artistApi } from '@/api/artistApi';
import { EntryComboBox } from '@/components/EntryComboBox';
import { IArtistDto } from '@/dto/IArtistDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { BasicEntryLinkStore } from '@/stores/BasicEntryLinkStore';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ArtistComboBoxProps {
	store: BasicEntryLinkStore<IArtistDto>;
}

export const ArtistComboBox = ({
	store,
}: ArtistComboBoxProps): React.ReactElement => {
	const { t } = useTranslation();

	const handleSearchChange = React.useCallback(
		(searchValue: string): Promise<ISearchResultDto<IArtistDto>> =>
			artistApi.list({
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
			placeholder={t('shared.selectArtist')}
		/>
	);
};
