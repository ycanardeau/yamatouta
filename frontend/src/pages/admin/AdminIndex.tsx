import { EuiIcon, EuiListGroup, EuiListGroupItem } from '@elastic/eui';
import {
	DatabaseSearchRegular,
	HistoryRegular,
	TextBulletListTreeRegular,
} from '@fluentui/react-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { adminApi } from '../../api/adminApi';
import { useAuth } from '../../components/useAuth';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';

const AdminIndex = (): React.ReactElement => {
	const { t, ready } = useTranslation();

	const auth = useAuth();

	useYamatoutaTitle(t('shared.manage'), ready);

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
					label={t('admin.populateIndex')}
					onClick={(): Promise<void> =>
						adminApi.updateSearchIndex({ forceUpdate: false })
					}
					isActive
				/>
				<EuiListGroupItem
					icon={<EuiIcon type={DatabaseSearchRegular} />}
					label={t('admin.rebuildIndex')}
					onClick={(): Promise<void> =>
						adminApi.updateSearchIndex({ forceUpdate: true })
					}
					isActive
				/>
				<EuiListGroupItem
					icon={<EuiIcon type={TextBulletListTreeRegular} />}
					label={t('admin.generateSitemaps')}
					onClick={(): Promise<void> => adminApi.generateSitemaps()}
					isActive
				/>
			</EuiListGroup>
		</>
	) : (
		<Navigate to="/" replace />
	);
};

export default AdminIndex;
