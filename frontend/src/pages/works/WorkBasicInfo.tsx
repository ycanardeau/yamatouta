import {
	EuiDescriptionList,
	EuiDescriptionListDescription,
	EuiDescriptionListTitle,
} from '@elastic/eui';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ArtistLinkDescriptionList } from '../../components/ArtistLinkDescriptionList';
import { WebLinkDescriptionList } from '../../components/WebLinkDescriptionList';
import { WorkDetailsObject } from '../../dto/WorkDetailsObject';

interface WorkBasicInfoProps {
	work: WorkDetailsObject;
}

const WorkBasicInfo = ({ work }: WorkBasicInfoProps): React.ReactElement => {
	const { t } = useTranslation();

	return (
		<>
			<div style={{ maxWidth: '400px' }}>
				<EuiDescriptionList type="column" compressed>
					<EuiDescriptionListTitle>
						{t('works.name')}
					</EuiDescriptionListTitle>
					<EuiDescriptionListDescription>
						{work.name}
					</EuiDescriptionListDescription>

					<EuiDescriptionListTitle>
						{t('works.workType')}
					</EuiDescriptionListTitle>
					<EuiDescriptionListDescription>
						{t(`workTypeNames.${work.workType}`)}
					</EuiDescriptionListDescription>

					{work.authors.length > 0 && (
						<ArtistLinkDescriptionList
							title={t('works.authors')}
							artistLinks={work.authors}
						/>
					)}
					{work.editors.length > 0 && (
						<ArtistLinkDescriptionList
							title={t('works.editors')}
							artistLinks={work.editors}
						/>
					)}
					{work.publishers.length > 0 && (
						<ArtistLinkDescriptionList
							title={t('works.publishers')}
							artistLinks={work.publishers}
						/>
					)}
					{work.translators.length > 0 && (
						<ArtistLinkDescriptionList
							title={t('works.translators')}
							artistLinks={work.translators}
						/>
					)}

					{work.webLinks.length > 0 && (
						<WebLinkDescriptionList webLinks={work.webLinks} />
					)}
				</EuiDescriptionList>
			</div>
		</>
	);
};

export default WorkBasicInfo;
