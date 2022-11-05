import { artistApi } from '@/api/artistApi';
import { EntryComboBox } from '@/components/EntryComboBox';
import { IArtistObject } from '@/dto/IArtistObject';
import { ISearchResultObject } from '@/dto/ISearchResultObject';
import { BasicEntryLinkStore } from '@/stores/BasicEntryLinkStore';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ArtistComboBoxProps {
	store: BasicEntryLinkStore<IArtistObject>;
}

export const ArtistComboBox = ({
	store,
}: ArtistComboBoxProps): React.ReactElement => {
	const { t } = useTranslation();

	const handleSearchChange = React.useCallback(
		(searchValue: string): Promise<ISearchResultObject<IArtistObject>> =>
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
