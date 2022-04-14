import {
	EuiButtonIcon,
	EuiContextMenuItem,
	EuiContextMenuPanel,
	EuiIcon,
	EuiLink,
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

import { IWorkObject } from '../../dto/works/IWorkObject';
import { Permission } from '../../models/Permission';
import { WorkSearchStore } from '../../stores/works/WorkSearchStore';
import Avatar from '../Avatar';
import Pagination from '../Pagination';
import { useAuth } from '../useAuth';
import { useDialog } from '../useDialog';
import DeleteWorkDialog from './DeleteWorkDialog';
import EditWorkDialog from './EditWorkDialog';

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

	const editWorkDialog = useDialog();
	const deleteWorkDialog = useDialog();

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
						icon={<EuiIcon type={HistoryRegular} />}
						href={`/works/${work.id}/revisions`}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(`/works/${work.id}/revisions`);
						}}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.ViewEditHistory,
							)
						}
					>
						{t('shared.viewHistory')}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type={EditRegular} />}
						onClick={(): void => {
							closePopover();
							editWorkDialog.show();
						}}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.EditWorks,
							)
						}
					>
						{t('shared.edit')}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type={DeleteRegular} color="danger" />}
						onClick={(): void => {
							closePopover();
							deleteWorkDialog.show();
						}}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.DeleteWorks,
							)
						}
					>
						{t('shared.delete')}
					</EuiContextMenuItem>
				</EuiContextMenuPanel>
			</EuiPopover>

			{editWorkDialog.visible && (
				<EditWorkDialog
					work={work}
					onClose={editWorkDialog.close}
					onSuccess={async (): Promise<void> => {
						await store.updateResults(true);
					}}
				/>
			)}

			{deleteWorkDialog.visible && (
				<DeleteWorkDialog
					work={work}
					onClose={deleteWorkDialog.close}
					onSuccess={async (): Promise<void> => {
						await store.updateResults(true);
					}}
				/>
			)}
		</>
	);
};

interface WorkSearchTableProps {
	store: WorkSearchStore;
}

const WorkSearchTable = observer(
	({ store }: WorkSearchTableProps): React.ReactElement => {
		const { t } = useTranslation();

		const navigate = useNavigate();

		return (
			<>
				<EuiTable>
					<EuiTableHeader>
						<EuiTableHeaderCell width={40} />
						<EuiTableHeaderCell>
							{t('works.name')}
						</EuiTableHeaderCell>
						<EuiTableHeaderCell width={32} />
					</EuiTableHeader>

					<EuiTableBody>
						{store.works.map((work) => (
							<EuiTableRow key={work.id}>
								<EuiTableRowCell>
									<Avatar size="m" name={work.name} />
								</EuiTableRowCell>
								<EuiTableRowCell
									mobileOptions={{
										header: t('works.name'),
									}}
								>
									<EuiLink
										href={`/works/${work.id}`}
										onClick={(
											e: React.MouseEvent<HTMLAnchorElement>,
										): void => {
											e.preventDefault();
											navigate(`/works/${work.id}`);
										}}
									>
										{work.name}
									</EuiLink>
								</EuiTableRowCell>
								<EuiTableRowCell
									textOnly={false}
									hasActions={true}
									align="right"
								>
									<WorkPopover store={store} work={work} />
								</EuiTableRowCell>
							</EuiTableRow>
						))}
					</EuiTableBody>
				</EuiTable>

				<EuiSpacer size="m" />

				<Pagination store={store.paginationStore} />
			</>
		);
	},
);

export default WorkSearchTable;