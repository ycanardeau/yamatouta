import { adminApi } from '@/api/adminApi';
import { useAuth } from '@/components/useAuth';
import { useYamatoutaTitle } from '@/components/useYamatoutaTitle';
import {
	EuiIcon,
	EuiListGroup,
	EuiListGroupItem,
	EuiPageTemplate,
} from '@elastic/eui';
import {
	DatabaseSearchRegular,
	HistoryRegular,
	OrganizationRegular,
} from '@fluentui/react-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

const AdminIndex = (): React.ReactElement => {
	const { t, ready } = useTranslation();

	const auth = useAuth();

	useYamatoutaTitle(t('shared.manage'), ready);

	return auth.user ? (
		<EuiPageTemplate.Section restrictWidth>
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
					icon={<EuiIcon type={OrganizationRegular} />}
					label={t('admin.generateSitemaps')}
					onClick={(): Promise<void> => adminApi.generateSitemaps()}
					isActive
				/>
			</EuiListGroup>
		</EuiPageTemplate.Section>
	) : (
		<Navigate to="/" replace />
	);
};

export default AdminIndex;
