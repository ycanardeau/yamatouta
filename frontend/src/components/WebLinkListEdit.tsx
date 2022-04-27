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

import { WebLinkCategory } from '../models/WebLinkCategory';
import {
	WebLinkEditStore,
	WebLinkListEditStore,
} from '../stores/WebLinkListEditStore';

interface WebLinkEditProps {
	webLinkListEditStore: WebLinkListEditStore;
	store: WebLinkEditStore;
}

const WebLinkEdit = observer(
	({ webLinkListEditStore, store }: WebLinkEditProps): React.ReactElement => {
		const { t } = useTranslation();

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
							/>
						}
					/>
				</EuiTableRowCell>
				<EuiTableRowCell
					textOnly={false}
					mobileOptions={{
						header: t('webLinks.title'),
						width: '100%',
					}}
				>
					<EuiFieldText
						compressed
						value={store.title}
						onChange={(e): void => store.setTitle(e.target.value)}
						fullWidth
					/>
				</EuiTableRowCell>
				<EuiTableRowCell
					textOnly={false}
					mobileOptions={{
						header: t('webLinks.category'),
						width: '100%',
					}}
				>
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
							store.setCategory(e.target.value as WebLinkCategory)
						}
						fullWidth
					/>
				</EuiTableRowCell>
				<EuiTableRowCell textOnly={false} align="right">
					<EuiButton
						onClick={(): void => webLinkListEditStore.remove(store)}
						size="s"
						color="danger"
						iconType={DeleteRegular}
					>
						{t('shared.remove')}
					</EuiButton>
				</EuiTableRowCell>
			</EuiTableRow>
		);
	},
);

interface WebLinkListEditProps {
	store: WebLinkListEditStore;
}

const WebLinkListEdit = observer(
	({ store }: WebLinkListEditProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<>
				<EuiTable>
					<EuiTableHeader>
						<EuiTableHeaderCell>
							{t('webLinks.url')}
						</EuiTableHeaderCell>
						<EuiTableHeaderCell>
							{t('webLinks.title')}
						</EuiTableHeaderCell>
						<EuiTableHeaderCell>
							{t('webLinks.category')}
						</EuiTableHeaderCell>
						<EuiTableHeaderCell />
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

				<EuiButton onClick={store.add} size="s" iconType={AddRegular}>
					{t('shared.add')}
				</EuiButton>
			</>
		);
	},
);

export default WebLinkListEdit;