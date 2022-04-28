import { EuiLink } from '@elastic/eui';
import React from 'react';

import { IWebLinkObject } from '../dto/IWebLinkObject';

interface WebLinkListProps {
	webLinks: IWebLinkObject[];
}

const WebLinkList = ({ webLinks }: WebLinkListProps): React.ReactElement => {
	return (
		<>
			{webLinks.map((webLink, index) => (
				<React.Fragment key={webLink.id}>
					{index > 0 && <br />}
					<EuiLink href={webLink.url} target="_blank">
						{webLink.title || webLink.url}
					</EuiLink>
				</React.Fragment>
			))}
		</>
	);
};

export default WebLinkList;
