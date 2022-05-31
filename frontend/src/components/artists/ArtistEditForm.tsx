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

import { WebLinkListEdit } from '../../components/WebLinkListEdit';
import { ArtistEditObject } from '../../dto/ArtistEditObject';
import { ArtistType } from '../../models/artists/ArtistType';
import { ArtistEditStore } from '../../stores/artists/ArtistEditStore';

interface ArtistEditFormProps {
	artist?: ArtistEditObject;
}

export const ArtistEditForm = observer(
	({ artist }: ArtistEditFormProps): React.ReactElement => {
		const { t } = useTranslation();

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

					<EuiFormRow label={t('shared.externalLinks')} fullWidth>
						<WebLinkListEdit store={store.webLinks} />
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
						href={artist ? `/artists/${artist.id}` : '/artists'}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(
								artist ? `/artists/${artist.id}` : '/artists',
							);
						}}
					>
						{t('shared.cancel')}
					</EuiButtonEmpty>
				</div>
			</>
		);
	},
);
