import {
	EuiButton,
	EuiButtonIcon,
	EuiFieldText,
	EuiSpacer,
	EuiTable,
	EuiTableBody,
	EuiTableHeader,
	EuiTableHeaderCell,
	EuiTableRow,
	EuiTableRowCell,
} from '@elastic/eui';
import { AddRegular, DeleteRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import {
	HashtagLinkEditStore,
	HashtagLinkListEditStore,
} from '../stores/HashtagLinkListEditStore';

interface HashtagEditProps {
	hashtagListEditStore: HashtagLinkListEditStore;
	store: HashtagLinkEditStore;
}

const HashtagEdit = observer(
	({ hashtagListEditStore, store }: HashtagEditProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<>
				<EuiTableRow hasActions={true}>
					<EuiTableRowCell
						textOnly={false}
						mobileOptions={{
							width: '100%',
						}}
					>
						<EuiFieldText
							compressed
							value={store.name}
							onChange={(e): void =>
								store.setName(e.target.value)
							}
							fullWidth
							prepend="#"
						/>
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
							onClick={(): void =>
								hashtagListEditStore.remove(store)
							}
							aria-label={t(`shared.remove`)}
							tabIndex={-1}
						/>
					</EuiTableRowCell>
				</EuiTableRow>
			</>
		);
	},
);

interface HashtagListEditProps {
	store: HashtagLinkListEditStore;
}

export const HashtagListEdit = observer(
	({ store }: HashtagListEditProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<>
				<EuiTable>
					<EuiTableHeader>
						<EuiTableHeaderCell />
						<EuiTableHeaderCell width={32} />
					</EuiTableHeader>

					<EuiTableBody>
						{store.items.map((item, index) => (
							<HashtagEdit
								hashtagListEditStore={store}
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
					disabled={false}
				>
					{t('shared.add')}
				</EuiButton>
			</>
		);
	},
);
