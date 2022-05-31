import { EuiLink, EuiLinkAnchorProps } from '@elastic/eui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

type LinkProps = Omit<EuiLinkAnchorProps, 'href' | 'onClick'> & { to: string };

export const Link = ({ to, ...props }: LinkProps): React.ReactElement => {
	const navigate = useNavigate();

	return (
		<EuiLink
			{...props}
			href={to}
			onClick={(e): void => {
				e.preventDefault();
				navigate(to);
			}}
		/>
	);
};
