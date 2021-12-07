import { Link } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { IAuthorDto } from '../dto/quotes/IQuoteDto';

interface IAuthorLinkProps {
	author: IAuthorDto;
	children: React.ReactNode;
}

const AuthorLink = ({
	author,
	children,
}: IAuthorLinkProps): React.ReactElement => {
	switch (author.authorType) {
		case 'artist':
			return (
				<Link
					component={RouterLink}
					to={`/artists/${author.id}`}
					underline="hover"
					color="inherit"
				>
					{children}
				</Link>
			);

		case 'user':
			return (
				<Link
					component={RouterLink}
					to={`/users/${author.id}`}
					underline="hover"
					color="inherit"
				>
					{children}
				</Link>
			);
	}
};

export default AuthorLink;
