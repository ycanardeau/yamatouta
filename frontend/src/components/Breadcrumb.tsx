import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs, Link } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface IBreadcrumbProps {
	items: {
		text: string;
		to: string;
		isCurrentItem?: boolean;
	}[];
}

const Breadcrumb = ({ items }: IBreadcrumbProps): React.ReactElement => {
	return (
		<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
			{items.map((item) => (
				<Link
					key={item.to}
					underline="hover"
					color={item.isCurrentItem ? 'text.primary' : 'inherit'}
					component={RouterLink}
					to={item.to}
					variant="h6"
				>
					{item.text}
				</Link>
			))}
		</Breadcrumbs>
	);
};

export default Breadcrumb;
