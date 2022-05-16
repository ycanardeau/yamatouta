import {
	EuiButton,
	EuiButtonEmpty,
	EuiFieldText,
	EuiForm,
	EuiFormRow,
	EuiModal,
	EuiModalBody,
	EuiModalFooter,
	EuiModalHeader,
	EuiModalHeaderTitle,
	EuiSelect,
	useGeneratedHtmlId,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IArtistObject } from '../../dto/IArtistObject';
import { ArtistType } from '../../models/ArtistType';
import { ArtistEditStore } from '../../stores/artists/ArtistEditStore';

interface ArtistCreateDialogProps {
	artist?: IArtistObject;
	onClose: () => void;
	onSuccess: (artist: IArtistObject) => void;
}

const ArtistCreateDialog = observer(
	({
		artist,
		onClose,
		onSuccess,
	}: ArtistCreateDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(() => new ArtistEditStore(artist));

		const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

		return (
			<EuiModal onClose={onClose} initialFocus="[name=name]">
				<EuiModalHeader>
					<EuiModalHeaderTitle>
						<h1>
							{artist
								? t('artists.editArtist')
								: t('artists.addArtist')}
						</h1>
					</EuiModalHeaderTitle>
				</EuiModalHeader>

				<EuiModalBody>
					<EuiForm
						id={modalFormId}
						component="form"
						onSubmit={async (e): Promise<void> => {
							e.preventDefault();

							const artist = await store.submit();

							onClose();
							onSuccess(artist);
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
								options={Object.values(ArtistType).map(
									(value) => ({
										value: value,
										text: t(`artistTypeNames.${value}`),
									}),
								)}
								value={store.artistType ?? ''}
								onChange={(e): void =>
									store.setArtistType(
										e.target.value as ArtistType,
									)
								}
							/>
						</EuiFormRow>
					</EuiForm>
				</EuiModalBody>

				<EuiModalFooter>
					<EuiButtonEmpty size="s" onClick={onClose}>
						{t('shared.cancel')}
					</EuiButtonEmpty>

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
				</EuiModalFooter>
			</EuiModal>
		);
	},
);

export default ArtistCreateDialog;
