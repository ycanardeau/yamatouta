import {
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import { useStoreWithPagination } from '@vocadb/route-sphere';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { UserBreadcrumbs } from '../../components/users/UserBreadcrumbs';
import { UserSearchOptions } from '../../components/users/UserSearchOptions';
import UserSearchTable from '../../components/users/UserSearchTable';
import { UserSearchStore } from '../../stores/users/UserSearchStore';

const UserIndex = observer((): React.ReactElement => {
	const { t, ready } = useTranslation();

	const [store] = React.useState(() => new UserSearchStore());

	useYamatoutaTitle(t('shared.users'), ready);

	useStoreWithPagination(store);

	return (
		<>
			<UserBreadcrumbs />
			<EuiSpacer size="xs" />
			<EuiPageHeader pageTitle={t('shared.users')} />

			<EuiPageContent
				hasBorder={false}
				hasShadow={false}
				paddingSize="none"
				color="transparent"
				borderRadius="none"
			>
				<EuiPageContentBody>
					<UserSearchOptions store={store} />

					<EuiSpacer size="m" />

					<UserSearchTable store={store} />
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
});

export default UserIndex;
