import {
	EuiDescriptionListDescription,
	EuiDescriptionListTitle,
	EuiLink,
} from '@elastic/eui';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IWebLinkObject } from '../dto/IWebLinkObject';
import { hostnameTitlePairs } from '../models/hostnameTitlePairs';

interface WebLinkProps {
	webLink: IWebLinkObject;
}

const WebLink = ({ webLink }: WebLinkProps): React.ReactElement => {
	const url = new URL(webLink.url);

	return (
		<EuiLink href={webLink.url} target="_blank">
			{webLink.title || hostnameTitlePairs[url.hostname] || webLink.url}
		</EuiLink>
	);
};

interface WebLinkListProps {
	webLinks: IWebLinkObject[];
}

const WebLinkList = React.memo(
	({ webLinks }: WebLinkListProps): React.ReactElement => {
		const ordered = React.useMemo(
			() =>
				_.chain(webLinks)
					.map((webLink) => ({
						...webLink,
						title:
							webLink.title ||
							hostnameTitlePairs[new URL(webLink.url).hostname] ||
							webLink.url,
					}))
					.orderBy((webLink) => webLink.title)
					.value(),
			[webLinks],
		);

		return (
			<>
				{ordered.map((webLink, index) => (
					<React.Fragment key={webLink.id}>
						{index > 0 && <br />}
						<WebLink webLink={webLink} />
					</React.Fragment>
				))}
			</>
		);
	},
);

interface WebLinkDescriptionListProps {
	webLinks: IWebLinkObject[];
}

export const WebLinkDescriptionList = ({
	webLinks,
}: WebLinkDescriptionListProps): React.ReactElement => {
	const { t } = useTranslation();

	return (
		<>
			<EuiDescriptionListTitle>
				{t('shared.externalLinks')}
			</EuiDescriptionListTitle>
			<EuiDescriptionListDescription>
				<WebLinkList webLinks={webLinks} />
			</EuiDescriptionListDescription>
		</>
	);
};
