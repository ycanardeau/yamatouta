import React from 'react';
import { useTranslation } from 'react-i18next';

import { ArtistEditForm } from '../../components/artists/ArtistEditForm';
import { ArtistPage } from '../../components/artists/ArtistPage';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';

const ArtistCreate = (): React.ReactElement => {
	const { t, ready } = useTranslation();

	const title = t('artists.addArtist');

	useYamatoutaTitle(title, ready);

	return (
		<ArtistPage pageHeaderProps={{ pageTitle: title }}>
			<ArtistEditForm />
		</ArtistPage>
	);
};

export default ArtistCreate;
