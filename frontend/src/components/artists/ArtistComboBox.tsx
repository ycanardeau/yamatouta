import { EuiComboBox, EuiComboBoxOptionOption } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { listArtists } from '../../api/ArtistApi';
import { IArtistObject } from '../../dto/IArtistObject';
import { BasicEntryLinkStore } from '../../stores/BasicEntryLinkStore';

interface ArtistComboBoxProps {
	store: BasicEntryLinkStore<IArtistObject>;
}

const ArtistComboBox = observer(
	({ store }: ArtistComboBoxProps): React.ReactElement => {
		const { t } = useTranslation();

		const [options, setOptions] = React.useState<EuiComboBoxOptionOption[]>(
			[],
		);

		const handleSearchChange = React.useCallback(
			async (searchValue: string): Promise<void> => {
				const artists = await listArtists({
					pagination: {
						offset: 0,
						limit: 20,
						getTotalCount: false,
					},
					query: searchValue,
				});

				setOptions(
					artists.items.map((artist) => ({
						key: artist.id.toString(),
						label: artist.name,
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
				placeholder={t('shared.selectArtist')}
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

export default ArtistComboBox;
