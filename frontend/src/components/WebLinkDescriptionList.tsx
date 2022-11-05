import { IWebLinkDto } from '@/dto/IWebLinkDto';
import { hostnameTitlePairs } from '@/models/hostnameTitlePairs';
import {
	EuiDescriptionListDescription,
	EuiDescriptionListTitle,
	EuiLink,
} from '@elastic/eui';
import { orderBy } from 'lodash-es';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface WebLinkProps {
	webLink: IWebLinkDto;
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
	webLinks: IWebLinkDto[];
}

const WebLinkList = React.memo(
	({ webLinks }: WebLinkListProps): React.ReactElement => {
		const ordered = React.useMemo(
			() =>
				orderBy(
					webLinks.map((webLink) => ({
						...webLink,
						title:
							webLink.title ||
							hostnameTitlePairs[new URL(webLink.url).hostname] ||
							webLink.url,
					})),
					(webLink) => webLink.title,
				),
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
	webLinks: IWebLinkDto[];
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
