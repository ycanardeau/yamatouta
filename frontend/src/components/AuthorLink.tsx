import { Link } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { IAuthorObject } from '../dto/quotes/IQuoteObject';

interface AuthorLinkProps {
	author: IAuthorObject;
	children: React.ReactNode;
}

const AuthorLink = ({
	author,
	children,
}: AuthorLinkProps): React.ReactElement => {
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
