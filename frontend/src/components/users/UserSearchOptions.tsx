import {
	EuiFieldSearch,
	EuiFlexGroup,
	EuiFlexItem,
	EuiFormControlLayout,
	EuiFormLabel,
	EuiSelect,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { UserGroup } from '../../models/users/UserGroup';
import { UserSortRule } from '../../models/users/UserSortRule';
import { UserSearchStore } from '../../stores/users/UserSearchStore';

interface UserSearchOptionsProps {
	store: UserSearchStore;
}

export const UserSearchOptions = observer(
	({ store }: UserSearchOptionsProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<EuiFlexGroup gutterSize="m">
				<EuiFlexItem>
					<EuiFieldSearch
						compressed
						fullWidth
						placeholder={t('users.search')}
						value={store.query}
						onChange={(e): void => store.setQuery(e.target.value)}
						onSearch={store.submit}
					/>
				</EuiFlexItem>

				<EuiFlexItem grow={false}>
					<EuiFormControlLayout
						compressed
						fullWidth
						prepend={
							<EuiFormLabel htmlFor="userGroup">
								{t('users.userGroup')}
							</EuiFormLabel>
						}
					>
						<EuiSelect
							compressed
							id="userGroup"
							options={[
								{
									value: '',
									text: t('shared.all'),
								},
								...Object.values(UserGroup).map((value) => ({
									value: value,
									text: t(`userGroupNames.${value}`),
								})),
							]}
							value={store.userGroup}
							onChange={(e): void =>
								store.setUserGroup(e.target.value as UserGroup)
							}
						/>
					</EuiFormControlLayout>
				</EuiFlexItem>

				<EuiFlexItem grow={false}>
					<EuiFormControlLayout
						compressed
						fullWidth
						prepend={
							<EuiFormLabel htmlFor="sort">
								{t('shared.sortBy')}
							</EuiFormLabel>
						}
					>
						<EuiSelect
							compressed
							id="sort"
							options={Object.values(UserSortRule).map(
								(value) => ({
									value: value,
									text: t(`userSortRuleNames.${value}`),
								}),
							)}
							value={store.sort}
							onChange={(e): void =>
								store.setSort(e.target.value as UserSortRule)
							}
						/>
					</EuiFormControlLayout>
				</EuiFlexItem>
			</EuiFlexGroup>
		);
	},
);
