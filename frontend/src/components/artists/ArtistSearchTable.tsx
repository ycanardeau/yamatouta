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

import Avatar from '../../components/Avatar';
import Pagination from '../../components/Pagination';
import { IArtistObject } from '../../dto/IArtistObject';
import { Permission } from '../../models/Permission';
import { ArtistSearchStore } from '../../stores/artists/ArtistSearchStore';
import Link from '../Link';
import { useAuth } from '../useAuth';
import { useDialog } from '../useDialog';
import ArtistDeleteDialog from './ArtistDeleteDialog';

interface ArtistPopoverProps {
	store: ArtistSearchStore;
	artist: IArtistObject;
}

const ArtistPopover = ({
	store,
	artist,
}: ArtistPopoverProps): React.ReactElement => {
	const { t } = useTranslation();

	const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
	const togglePopover = (): void => setIsPopoverOpen(!isPopoverOpen);
	const closePopover = (): void => setIsPopoverOpen(false);

	const navigate = useNavigate();

	const artistDeleteDialog = useDialog();

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
						href={`/artists/${artist.id}`}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(`/artists/${artist.id}`);
						}}
					>
						{t('shared.viewBasicInfo')}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type={EditRegular} />}
						href={`/artists/${artist.id}/edit`}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(`/artists/${artist.id}/edit`);
						}}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.Artist_Update,
							)
						}
					>
						{t('shared.doEdit')}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type={HistoryRegular} />}
						href={`/artists/${artist.id}/revisions`}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(`/artists/${artist.id}/revisions`);
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
							artistDeleteDialog.show();
						}}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.Artist_Delete,
							)
						}
					>
						{t('shared.delete')}
					</EuiContextMenuItem>
				</EuiContextMenuPanel>
			</EuiPopover>

			{artistDeleteDialog.visible && (
				<ArtistDeleteDialog
					artist={artist}
					onClose={artistDeleteDialog.close}
					onSuccess={async (): Promise<void> => {
						await store.updateResults(true);
					}}
				/>
			)}
		</>
	);
};

interface ArtistSearchTableProps {
	store: ArtistSearchStore;
}

const ArtistSearchTable = observer(
	({ store }: ArtistSearchTableProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<>
				<EuiTable>
					<EuiTableHeader>
						<EuiTableHeaderCell width={40} />
						<EuiTableHeaderCell>
							{t('artists.name')}
						</EuiTableHeaderCell>
						<EuiTableHeaderCell width={32} />
					</EuiTableHeader>

					<EuiTableBody>
						{store.artists.map((artist) => (
							<EuiTableRow key={artist.id}>
								<EuiTableRowCell>
									<Avatar
										size="m"
										name={artist.name}
										imageUrl={artist.avatarUrl ?? ''}
									/>
								</EuiTableRowCell>
								<EuiTableRowCell
									mobileOptions={{
										header: t('artists.name'),
									}}
								>
									<Link to={`/artists/${artist.id}`}>
										{artist.name}
									</Link>
								</EuiTableRowCell>
								<EuiTableRowCell
									textOnly={false}
									hasActions={true}
									align="right"
								>
									<ArtistPopover
										store={store}
										artist={artist}
									/>
								</EuiTableRowCell>
							</EuiTableRow>
						))}
					</EuiTableBody>
				</EuiTable>

				<EuiSpacer size="m" />

				<Pagination store={store.pagination} />
			</>
		);
	},
);

export default ArtistSearchTable;
