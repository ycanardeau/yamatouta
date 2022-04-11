import { EuiIcon, EuiListGroup, EuiListGroupItem } from '@elastic/eui';
import { HistoryRegular } from '@fluentui/react-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { createMissingRevisions } from '../../api/AdminApi';
import { useAuth } from '../../components/useAuth';

const AdminIndex = (): React.ReactElement => {
	const { t } = useTranslation();

	const auth = useAuth();

	return auth.user ? (
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
	) : (
		<Navigate to="/" replace />
	);
};

export default AdminIndex;
