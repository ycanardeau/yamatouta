import {
	EuiButton,
	EuiButtonEmpty,
	EuiFieldText,
	EuiForm,
	EuiFormRow,
	EuiSelect,
	EuiSpacer,
	useGeneratedHtmlId,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ArtistType } from '../../models/ArtistType';
import { ArtistDetailsStore } from '../../stores/artists/ArtistDetailsStore';
import { ArtistEditStore } from '../../stores/artists/ArtistEditStore';

interface ArtistEditProps {
	artistDetailsStore: ArtistDetailsStore;
}

const ArtistEdit = observer(
	({ artistDetailsStore }: ArtistEditProps): React.ReactElement => {
		const { t } = useTranslation();

		const artist = artistDetailsStore.artist;

		const [store] = React.useState(() => new ArtistEditStore(artist));

		const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

		const navigate = useNavigate();

		return (
			<>
				<EuiForm
					id={modalFormId}
					component="form"
					onSubmit={async (e): Promise<void> => {
						e.preventDefault();

						const artist = await store.submit();

						artistDetailsStore.setArtist(artist);
						navigate(`/artists/${artist.id}`);
					}}
				>
					<EuiFormRow label={t('artists.name')}>
						<EuiFieldText
							compressed
							name="name"
							value={store.name}
							onChange={(e): void =>
								store.setName(e.target.value)
							}
						/>
					</EuiFormRow>

					<EuiFormRow label={t('artists.artistType')}>
						<EuiSelect
							compressed
							name="artistType"
							options={Object.values(ArtistType).map((value) => ({
								value: value,
								text: t(`artistTypeNames.${value}`),
							}))}
							value={store.artistType ?? ''}
							onChange={(e): void =>
								store.setArtistType(
									e.target.value as ArtistType,
								)
							}
						/>
					</EuiFormRow>
				</EuiForm>

				<EuiSpacer />

				<div>
					<EuiButton
						size="s"
						type="submit"
						form={modalFormId}
						disabled={!store.isValid || store.submitting}
					>
						{artist
							? t('artists.editArtist')
							: t('artists.addArtist')}
					</EuiButton>
					&emsp;
					<EuiButtonEmpty
						size="s"
						href={`/artists/${artist.id}`}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/artists/${artist.id}`);
						}}
					>
						{t('shared.cancel')}
					</EuiButtonEmpty>
				</div>
			</>
		);
	},
);

export default ArtistEdit;
