import {
	EuiDescriptionList,
	EuiDescriptionListDescription,
	EuiDescriptionListTitle,
} from '@elastic/eui';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { WebLinkList } from '../../components/WebLinkList';
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

					{work.webLinks.length > 0 && (
						<>
							<EuiDescriptionListTitle>
								{t('shared.externalLinks')}
							</EuiDescriptionListTitle>
							<EuiDescriptionListDescription>
								<WebLinkList webLinks={work.webLinks} />
							</EuiDescriptionListDescription>
						</>
					)}
				</EuiDescriptionList>
			</div>
		</>
	);
};

export default WorkBasicInfo;
