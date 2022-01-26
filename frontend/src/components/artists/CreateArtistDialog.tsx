import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	Select,
	Stack,
	TextField,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IArtistObject } from '../../dto/artists/IArtistObject';
import { ArtistType } from '../../models/ArtistType';
import { CreateArtistDialogStore } from '../../stores/CreateArtistDialogStore';

interface ICreateArtistDialogProps {
	onClose: () => void;
	onCreateArtistComplete: (artist: IArtistObject) => void;
}

const CreateArtistDialog = observer(
	({
		onClose,
		onCreateArtistComplete,
	}: ICreateArtistDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(() => new CreateArtistDialogStore());

		return (
			<Dialog open={true} onClose={onClose} fullWidth>
				<form
					onSubmit={async (event): Promise<void> => {
						event.preventDefault();

						const artist = await store.submit();

						onCreateArtistComplete(artist);
					}}
				>
					<DialogTitle>{t('artists.addArtist')}</DialogTitle>
					<DialogContent>
						<Stack spacing={2}>
							<FormControl variant="standard" fullWidth>
								<TextField
									autoFocus
									margin="dense"
									id="name"
									label={t('artists.name')}
									type="text"
									variant="standard"
									value={store.name}
									onChange={(event): void =>
										store.setName(event.target.value)
									}
								/>
							</FormControl>

							<FormControl variant="standard" fullWidth>
								<InputLabel id="artistType">
									{t('artists.artistType')}
								</InputLabel>
								<Select
									labelId="artistType"
									id="artistType"
									value={store.artistType}
									onChange={(event): void =>
										store.setArtistType(
											event.target.value as ArtistType,
										)
									}
								>
									{Object.values(ArtistType).map((value) => (
										<MenuItem key={value} value={value}>
											{t(`artistTypeNames.${value}`)}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button onClick={onClose}>{t('shared.cancel')}</Button>
						<Button
							type="submit"
							disabled={!store.isValid || store.submitting}
						>
							{t('artists.addArtist')}
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		);
	},
);

export default CreateArtistDialog;
