import { Avatar, Button, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { IQuoteObject } from '../../dto/quotes/IQuoteObject';
import AuthorLink from '../AuthorLink';

interface QuoteListItemProps {
	quote: IQuoteObject;
	showDetailsButton: boolean;
}

const QuoteListItem = React.memo(
	({ quote, showDetailsButton }: QuoteListItemProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<Paper sx={{ my: 1, p: 2 }}>
				<Grid container wrap="nowrap" spacing={2}>
					<Grid item>
						<AuthorLink author={quote.author}>
							<Avatar
								alt={quote.author.name}
								src={quote.author.avatarUrl}
							/>
						</AuthorLink>
					</Grid>
					<Grid item xs>
						<Grid item container xs alignItems="center">
							<Grid item xs>
								<Typography>
									<AuthorLink author={quote.author}>
										{quote.author.name}
									</AuthorLink>
								</Typography>
							</Grid>
							<Grid item>
								{showDetailsButton && (
									<Button
										size="small"
										component={RouterLink}
										to={`/quotes/${quote.id}`}
									>
										{t('shared.details')}
									</Button>
								)}
							</Grid>
						</Grid>
						<Typography variant="body2" color="text.secondary">
							{quote.phrases.map((phrase, index) => (
								<React.Fragment key={index}>
									{index > 0 && <br />}
									{phrase}
								</React.Fragment>
							))}
						</Typography>
					</Grid>
				</Grid>
			</Paper>
		);
	},
);

export default QuoteListItem;
