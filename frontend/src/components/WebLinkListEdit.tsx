import {
	EuiButton,
	EuiButtonIcon,
	EuiFieldText,
	EuiIcon,
	EuiSelect,
	EuiSpacer,
	EuiTable,
	EuiTableBody,
	EuiTableHeader,
	EuiTableHeaderCell,
	EuiTableRow,
	EuiTableRowCell,
} from '@elastic/eui';
import {
	AddRegular,
	DeleteRegular,
	LinkRegular,
	OpenRegular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Permission } from '../models/Permission';
import { WebLinkCategory } from '../models/WebLinkCategory';
import {
	WebLinkEditStore,
	WebLinkListEditStore,
} from '../stores/WebLinkListEditStore';
import { useAuth } from './useAuth';

interface WebLinkEditProps {
	webLinkListEditStore: WebLinkListEditStore;
	store: WebLinkEditStore;
}

const WebLinkEdit = observer(
	({ webLinkListEditStore, store }: WebLinkEditProps): React.ReactElement => {
		const { t } = useTranslation();

		const auth = useAuth();

		return (
			<EuiTableRow>
				<EuiTableRowCell
					textOnly={false}
					mobileOptions={{ header: t('webLinks.url'), width: '100%' }}
				>
					<EuiFieldText
						compressed
						value={store.url}
						onChange={(e): void => store.setUrl(e.target.value)}
						fullWidth
						prepend={<EuiIcon type={LinkRegular} />}
						append={
							<EuiButtonIcon
								iconType={OpenRegular}
								href={store.url}
								target="_blank"
								isDisabled={!store.url}
								aria-label={t('shared.externalLink')}
							/>
						}
						readOnly={
							!auth.permissionContext.hasPermission(
								Permission.WebLink_Update,
							)
						}
					/>
				</EuiTableRowCell>
				<EuiTableRowCell
					textOnly={false}
					mobileOptions={{
						header: t('webLinks.category'),
						width: '100%',
					}}
				>
					{auth.permissionContext.hasPermission(
						Permission.WebLink_Update,
					) ? (
						<EuiSelect
							compressed
							name="category"
							options={Object.values(WebLinkCategory).map(
								(value) => ({
									value: value,
									text: t(`webLinkCategoryNames.${value}`),
								}),
							)}
							value={store.category}
							onChange={(e): void =>
								store.setCategory(
									e.target.value as WebLinkCategory,
								)
							}
							fullWidth
						/>
					) : (
						<EuiFieldText
							compressed
							value={`${t(
								`webLinkCategoryNames.${store.category}`,
							)}`}
							fullWidth
							readOnly={
								!auth.permissionContext.hasPermission(
									Permission.WebLink_Update,
								)
							}
						/>
					)}
				</EuiTableRowCell>
				<EuiTableRowCell
					textOnly={false}
					hasActions={true}
					align="right"
				>
					<EuiButtonIcon
						iconType={DeleteRegular}
						size="xs"
						color="danger"
						onClick={(): void => webLinkListEditStore.remove(store)}
						aria-label={t(`shared.remove`)}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.WebLink_Delete,
							)
						}
					/>
				</EuiTableRowCell>
			</EuiTableRow>
		);
	},
);

interface WebLinkListEditProps {
	store: WebLinkListEditStore;
}

export const WebLinkListEdit = observer(
	({ store }: WebLinkListEditProps): React.ReactElement => {
		const { t } = useTranslation();

		const auth = useAuth();

		return (
			<>
				<EuiTable>
					<EuiTableHeader>
						<EuiTableHeaderCell>
							{t('webLinks.url')}
						</EuiTableHeaderCell>
						<EuiTableHeaderCell>
							{t('webLinks.category')}
						</EuiTableHeaderCell>
						<EuiTableHeaderCell width={32} />
					</EuiTableHeader>

					<EuiTableBody>
						{store.items.map((item, index) => (
							<WebLinkEdit
								webLinkListEditStore={store}
								store={item}
								key={index}
							/>
						))}
					</EuiTableBody>
				</EuiTable>

				<EuiSpacer size="m" />

				<EuiButton
					onClick={store.add}
					size="s"
					iconType={AddRegular}
					disabled={
						!auth.permissionContext.hasPermission(
							Permission.WebLink_Create,
						)
					}
				>
					{t('shared.add')}
				</EuiButton>
			</>
		);
	},
);
