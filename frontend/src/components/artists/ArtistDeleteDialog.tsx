import { EuiConfirmModal } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IArtistObject } from '../../dto/IArtistObject';
import { ArtistDeleteStore } from '../../stores/artists/ArtistDeleteStore';

interface ArtistDeleteDialogProps {
	artist: IArtistObject;
	onClose: () => void;
	onSuccess: () => void;
}

const ArtistDeleteDialog = observer(
	({
		artist,
		onClose,
		onSuccess,
	}: ArtistDeleteDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(() => new ArtistDeleteStore(artist));

		return (
			<EuiConfirmModal
				title={t('artists.deleteArtist')}
				onCancel={onClose}
				onConfirm={async (): Promise<void> => {
					await store.submit();

					onClose();
					onSuccess();
				}}
				cancelButtonText={t('shared.cancel')}
				confirmButtonText={t('artists.deleteArtist')}
				buttonColor="danger"
				defaultFocusedButton="confirm"
				confirmButtonDisabled={!store.isValid || store.submitting}
			>
				{t('artists.deleteDialogSubtitle')}
			</EuiConfirmModal>
		);
	},
);

export default ArtistDeleteDialog;
