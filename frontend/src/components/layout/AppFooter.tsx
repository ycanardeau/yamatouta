import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import {
	Box,
	Container,
	Divider,
	IconButton,
	Link,
	Stack,
	Typography,
} from '@mui/material';
import React from 'react';

import DiscordIcon from '../simpleicons/DiscordIcon';

const AppFooter = (): React.ReactElement => {
	return (
		<Container component="footer">
			<Divider />
			<Box
				sx={{
					py: 4,
					display: { xs: 'block', sm: 'flex' },
					alignItems: { sm: 'center' },
					justifyContent: { sm: 'space-between' },
				}}
			>
				<Typography color="text.secondary" variant="body2">
					Copyright © 2021-{new Date().getFullYear()}{' '}
					<Link
						target="_blank"
						rel="noopener noreferrer"
						href="https://github.com/ycanardeau"
						underline="hover"
					>
						Aigamo
					</Link>
				</Typography>
				<Box sx={{ py: { xs: 2, sm: 0 } }}>
					<Stack spacing={2} direction="row">
						<IconButton
							target="_blank"
							rel="noopener noreferrer"
							href="https://github.com/ycanardeau/yamatouta"
							title="GitHub"
							size="small"
						>
							<GitHubIcon />
						</IconButton>
						<IconButton
							target="_blank"
							rel="noopener noreferrer"
							href="https://discord.gg/fEzJdbKnam"
							title="Discord"
							size="small"
						>
							<DiscordIcon />
						</IconButton>
						<IconButton
							target="_blank"
							rel="noopener noreferrer"
							href="https://twitter.com/inishienomanabi"
							title="Twitter"
							size="small"
						>
							<TwitterIcon />
						</IconButton>
					</Stack>
				</Box>
			</Box>
		</Container>
	);
};

export default AppFooter;
