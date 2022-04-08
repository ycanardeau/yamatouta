import { EuiIcon, EuiListGroup, EuiListGroupItem } from '@elastic/eui';
import { HistoryRegular } from '@fluentui/react-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { createMissingRevisions } from '../../api/AdminApi';

const AdminIndex = (): React.ReactElement => {
	const { t } = useTranslation();

	return (
		<>
			<EuiListGroup>
				<EuiListGroupItem
					icon={<EuiIcon type={HistoryRegular} />}
					label={t('admin.createMissingRevisions')}
					onClick={(): Promise<void> => createMissingRevisions()}
					isActive
				/>
			</EuiListGroup>
		</>
	);
};

export default AdminIndex;
