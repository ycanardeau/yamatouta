import {
	EuiButtonIcon,
	EuiContextMenuItem,
	EuiContextMenuPanel,
	EuiIcon,
	EuiPopover,
	EuiSpacer,
	EuiTable,
	EuiTableBody,
	EuiTableHeader,
	EuiTableHeaderCell,
	EuiTableRow,
	EuiTableRowCell,
} from '@elastic/eui';
import {
	DeleteRegular,
	EditRegular,
	HistoryRegular,
	InfoRegular,
	MoreHorizontalRegular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IWorkObject } from '../../dto/IWorkObject';
import { Permission } from '../../models/Permission';
import { WorkSearchStore } from '../../stores/works/WorkSearchStore';
import { Avatar } from '../Avatar';
import { Link } from '../Link';
import { Pagination } from '../Pagination';
import { useAuth } from '../useAuth';
import { useDialog } from '../useDialog';
import { WorkDeleteDialog } from './WorkDeleteDialog';

const WorkSearchTableHeader = React.memo((): React.ReactElement => {
	const { t } = useTranslation();

	return (
		<EuiTableHeader>
			<EuiTableHeaderCell width={40} />
			<EuiTableHeaderCell>{t('works.name')}</EuiTableHeaderCell>
			<EuiTableHeaderCell width={32} />
		</EuiTableHeader>
	);
});

interface WorkPopoverProps {
	store: WorkSearchStore;
	work: IWorkObject;
}

const WorkPopover = ({ store, work }: WorkPopoverProps): React.ReactElement => {
	const { t } = useTranslation();

	const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
	const togglePopover = (): void => setIsPopoverOpen(!isPopoverOpen);
	const closePopover = (): void => setIsPopoverOpen(false);

	const navigate = useNavigate();

	const workDeleteDialog = useDialog();

	const auth = useAuth();

	return (
		<>
			<EuiPopover
				button={
					<EuiButtonIcon
						iconType={MoreHorizontalRegular}
						size="xs"
						color="text"
						onClick={togglePopover}
						aria-label={t(`shared.actions`)}
					/>
				}
				isOpen={isPopoverOpen}
				closePopover={closePopover}
				panelPaddingSize="none"
				anchorPosition="leftCenter"
			>
				<EuiContextMenuPanel>
					<EuiContextMenuItem
						icon={<EuiIcon type={InfoRegular} />}
						href={`/works/${work.id}`}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(`/works/${work.id}`);
						}}
					>
						{t('shared.viewBasicInfo')}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type={EditRegular} />}
						href={`/works/${work.id}/edit`}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(`/works/${work.id}/edit`);
						}}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.Work_Update,
							)
						}
					>
						{t('shared.doEdit')}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type={HistoryRegular} />}
						href={`/works/${work.id}/revisions`}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(`/works/${work.id}/revisions`);
						}}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.Revision_View,
							)
						}
					>
						{t('shared.viewHistory')}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type={DeleteRegular} color="danger" />}
						onClick={(): void => {
							closePopover();
							workDeleteDialog.show();
						}}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.Work_Delete,
							)
						}
					>
						{t('shared.delete')}
					</EuiContextMenuItem>
				</EuiContextMenuPanel>
			</EuiPopover>

			{workDeleteDialog.visible && (
				<WorkDeleteDialog
					work={work}
					onClose={workDeleteDialog.close}
					onSuccess={async (): Promise<void> => {
						await store.updateResults(true);
					}}
				/>
			)}
		</>
	);
};

interface WorkSearchTableRowProps {
	store: WorkSearchStore;
	work: IWorkObject;
}

const WorkSearchTableRow = React.memo(
	({ store, work }: WorkSearchTableRowProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<EuiTableRow>
				<EuiTableRowCell>
					<Avatar size="m" name={work.name} />
				</EuiTableRowCell>
				<EuiTableRowCell
					mobileOptions={{
						header: t('works.name'),
					}}
				>
					<Link to={`/works/${work.id}`}>{work.name}</Link>
				</EuiTableRowCell>
				<EuiTableRowCell
					textOnly={false}
					hasActions={true}
					align="right"
				>
					<WorkPopover store={store} work={work} />
				</EuiTableRowCell>
			</EuiTableRow>
		);
	},
);

interface WorkSearchTableBodyProps {
	store: WorkSearchStore;
}

const WorkSearchTableBody = observer(
	({ store }: WorkSearchTableBodyProps): React.ReactElement => {
		return (
			<EuiTableBody>
				{store.works.map((work) => (
					<WorkSearchTableRow
						store={store}
						work={work}
						key={work.id}
					/>
				))}
			</EuiTableBody>
		);
	},
);

interface WorkSearchTableProps {
	store: WorkSearchStore;
}

export const WorkSearchTable = ({
	store,
}: WorkSearchTableProps): React.ReactElement => {
	return (
		<>
			<EuiTable>
				<WorkSearchTableHeader />
				<WorkSearchTableBody store={store} />
			</EuiTable>

			<EuiSpacer size="m" />

			<Pagination store={store.pagination} />
		</>
	);
};
