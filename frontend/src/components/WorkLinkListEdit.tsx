import {
	EuiButton,
	EuiButtonIcon,
	EuiSelect,
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

import { LinkType } from '../models/LinkType';
import {
	WorkLinkEditStore,
	WorkLinkListEditStore,
} from '../stores/WorkLinkListEditStore';
import { WorkComboBox } from './works/WorkComboBox';

interface WorkLinkEditProps {
	workLinkListEditStore: WorkLinkListEditStore;
	store: WorkLinkEditStore;
	allowedLinkTypes: LinkType[];
}

const WorkLinkEdit = observer(
	({
		workLinkListEditStore,
		store,
		allowedLinkTypes,
	}: WorkLinkEditProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<EuiTableRow hasActions={true}>
				<EuiTableRowCell
					textOnly={false}
					mobileOptions={{
						header: t('links.linkType'),
						width: '100%',
					}}
				>
					<EuiSelect
						compressed
						options={allowedLinkTypes.map((linkType) => ({
							value: linkType,
							text: t(`linkPhrases.${linkType}`),
						}))}
						value={store.linkType}
						onChange={(e): void =>
							store.setLinkType(e.target.value as LinkType)
						}
						fullWidth
					/>
				</EuiTableRowCell>
				<EuiTableRowCell
					textOnly={false}
					mobileOptions={{
						header: t('shared.work'),
						width: '100%',
					}}
				>
					<WorkComboBox store={store.relatedWork} />
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
						tabIndex={-1}
					/>
				</EuiTableRowCell>
			</EuiTableRow>
		);
	},
);

interface WorkLinkListEditProps {
	store: WorkLinkListEditStore;
	allowedLinkTypes: LinkType[];
}

export const WorkLinkListEdit = observer(
	({
		store,
		allowedLinkTypes,
	}: WorkLinkListEditProps): React.ReactElement => {
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
								allowedLinkTypes={allowedLinkTypes}
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
