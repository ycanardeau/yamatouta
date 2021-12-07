import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	InputLabel,
	Select,
	TextField,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ArtistType } from '../dto/artists/ArtistType';
import { CreateArtistDialogStore } from '../stores/CreateArtistDialogStore';

interface ICreateArtistDialogProps {
	store: CreateArtistDialogStore;
}

const CreateArtistDialog = observer(
	({ store }: ICreateArtistDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const navigate = useNavigate();

		return (
			<Dialog open={store.dialogOpen} onClose={store.hide} fullWidth>
				<DialogTitle>{t('artists.addArtist')}</DialogTitle>
				<DialogContent>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<FormControl variant="standard" fullWidth>
								<TextField
									autoFocus
									margin="dense"
									id="name"
									label={t('artists.name')}
									type="text"
									variant="standard"
									value={store.name}
									onChange={(e): void =>
										store.setName(e.target.value)
									}
								/>
							</FormControl>
						</Grid>

						<Grid item xs={12}>
							<FormControl variant="standard" fullWidth>
								<InputLabel id="artistType">
									{t('artists.artistType')}
								</InputLabel>
								<Select
									labelId="artistType"
									id="artistType"
									value={store.artistType}
									onChange={(e): void =>
										store.setArtistType(
											e.target.value as ArtistType,
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
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={store.hide}>{t('shared.cancel')}</Button>
					<Button
						onClick={async (): Promise<void> => {
							const artist = await store.submit();

							navigate(`/artists/${artist.id}`);
						}}
						disabled={!store.isValid || store.submitting}
					>
						{t('artists.addArtist')}
					</Button>
				</DialogActions>
			</Dialog>
		);
	},
);

export default CreateArtistDialog;
