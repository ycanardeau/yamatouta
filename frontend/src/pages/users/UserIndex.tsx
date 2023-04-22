import { useYamatoutaTitle } from '@/components/useYamatoutaTitle';
import { UserPage } from '@/components/users/UserPage';
import { UserSearchOptions } from '@/components/users/UserSearchOptions';
import UserSearchTable from '@/components/users/UserSearchTable';
import { UserSearchStore } from '@/stores/users/UserSearchStore';
import { useLocationStateStore } from '@aigamo/route-sphere';
import { EuiSpacer } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

const UserIndex = observer((): React.ReactElement => {
	const { t, ready } = useTranslation();

	const [store] = React.useState(() => new UserSearchStore());

	useYamatoutaTitle(t('shared.users'), ready);

	useLocationStateStore(store);

	return (
		<UserPage pageHeaderProps={{ pageTitle: t('shared.users') }}>
			<UserSearchOptions store={store} />

			<EuiSpacer size="m" />

			<UserSearchTable store={store} />
		</UserPage>
	);
});

export default UserIndex;
