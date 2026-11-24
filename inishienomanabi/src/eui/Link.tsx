import { EuiLink, EuiLinkProps } from '@elastic/eui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// An EuiLink that navigates within the app.
const Link = ({
	to,
	...props
}: { to: string } & Omit<
	EuiLinkProps,
	'href' | 'onClick'
>): React.ReactElement => {
	const navigate = useNavigate();

	return (
		<EuiLink
			{...(props as any)}
			href={to}
			onClick={(e: React.MouseEvent): void => {
				if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0)
					return;
				e.preventDefault();
				navigate(to);
			}}
		/>
	);
};

export default Link;
