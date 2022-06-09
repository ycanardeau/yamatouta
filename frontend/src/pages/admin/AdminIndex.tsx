import { EuiIcon, EuiListGroup, EuiListGroupItem } from '@elastic/eui';
import { DatabaseSearchRegular, HistoryRegular } from '@fluentui/react-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { adminApi } from '../../api/adminApi';
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
					onClick={(): Promise<void> =>
						adminApi.createMissingRevisions()
					}
					isActive
				/>
				<EuiListGroupItem
					icon={<EuiIcon type={DatabaseSearchRegular} />}
					label={t('admin.updateSearchIndex')}
					onClick={(): Promise<void> =>
						adminApi.updateSearchIndex({ forceUpdate: false })
					}
					isActive
				/>
			</EuiListGroup>
		</>
	) : (
		<Navigate to="/" replace />
	);
};

export default AdminIndex;
