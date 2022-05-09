import {
	EuiButton,
	EuiButtonIcon,
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

import { EntryType } from '../models/EntryType';
import {
	WorkLinkEditStore,
	WorkLinkListEditStore,
} from '../stores/WorkLinkListEditStore';
import LinkTypeComboBox from './LinkTypeComboBox';
import WorkComboBox from './works/WorkComboBox';

interface WorkLinkEditProps {
	workLinkListEditStore: WorkLinkListEditStore;
	store: WorkLinkEditStore;
	entryType: EntryType;
}

const WorkLinkEdit = observer(
	({
		workLinkListEditStore,
		store,
		entryType,
	}: WorkLinkEditProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<EuiTableRow>
				<EuiTableRowCell
					textOnly={false}
					mobileOptions={{
						header: t('links.linkType'),
						width: '100%',
					}}
				>
					<LinkTypeComboBox
						store={store.linkType}
						entryType={entryType}
						relatedEntryType={EntryType.Work}
					/>
				</EuiTableRowCell>
				<EuiTableRowCell
					textOnly={false}
					mobileOptions={{
						header: t('shared.work'),
						width: '100%',
					}}
				>
					<WorkComboBox store={store.work} />
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
							workLinkListEditStore.remove(store)
						}
						aria-label={t(`shared.remove`)}
					/>
				</EuiTableRowCell>
			</EuiTableRow>
		);
	},
);

interface WorkLinkListEditProps {
	store: WorkLinkListEditStore;
	entryType: EntryType;
}

const WorkLinkListEdit = observer(
	({ store, entryType }: WorkLinkListEditProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<>
				<EuiTable>
					<EuiTableHeader>
						<EuiTableHeaderCell>
							{t('links.linkType')}
						</EuiTableHeaderCell>
						<EuiTableHeaderCell>
							{t('shared.work')}
						</EuiTableHeaderCell>
						<EuiTableHeaderCell width={32} />
					</EuiTableHeader>

					<EuiTableBody>
						{store.items.map((item, index) => (
							<WorkLinkEdit
								workLinkListEditStore={store}
								store={item}
								entryType={entryType}
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

export default WorkLinkListEdit;
