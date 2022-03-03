import {
	EuiHeader,
	EuiHeaderLink,
	EuiHeaderSection,
	EuiHeaderSectionItem,
} from '@elastic/eui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = (): React.ReactElement => {
	const navigate = useNavigate();

	return (
		<EuiHeader position="fixed">
			<EuiHeaderSection grow={false}>
				<EuiHeaderSectionItem border="right">
					<EuiHeaderLink
						href="/"
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate('/');
						}}
					>
						やまとうた
					</EuiHeaderLink>
				</EuiHeaderSectionItem>
			</EuiHeaderSection>

			<EuiHeaderSection side="right">
				<EuiHeaderSectionItem></EuiHeaderSectionItem>
			</EuiHeaderSection>
		</EuiHeader>
	);
};

export default Header;
