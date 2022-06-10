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
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Avatar } from '../../components/Avatar';
import { Pagination } from '../../components/Pagination';
import { IArtistObject } from '../../dto/IArtistObject';
import { Permission } from '../../models/Permission';
import { ArtistSearchStore } from '../../stores/artists/ArtistSearchStore';
import { Link } from '../Link';
import { TableEmptyBody } from '../TableEmptyBody';
import { useAuth } from '../useAuth';
import { useDialog } from '../useDialog';
import { ArtistDeleteDialog } from './ArtistDeleteDialog';

const ArtistSearchTableHeader = React.memo((): React.ReactElement => {
	const { t } = useTranslation();

	return (
		<EuiTableHeader>
			<EuiTableHeaderCell>{t('artists.name')}</EuiTableHeaderCell>
			<EuiTableHeaderCell width={32} />
		</EuiTableHeader>
	);
});

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
								Permission.UpdateArtists,
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
								Permission.ViewRevisions,
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
								Permission.DeleteArtists,
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

interface ArtistSearchTableRowProps {
	store: ArtistSearchStore;
	artist: IArtistObject;
}

const ArtistSearchTableRow = React.memo(
	({ store, artist }: ArtistSearchTableRowProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<EuiTableRow hasActions={true}>
				<EuiTableRowCell
					mobileOptions={{
						header: t('artists.name'),
					}}
				>
					<span>
						<Avatar
							size="m"
							name={artist.name}
							imageUrl={artist.avatarUrl ?? ''}
						/>{' '}
						<Link to={`/artists/${artist.id}`}>{artist.name}</Link>
					</span>
				</EuiTableRowCell>
				<EuiTableRowCell
					textOnly={false}
					hasActions={true}
					align="right"
				>
					<ArtistPopover store={store} artist={artist} />
				</EuiTableRowCell>
			</EuiTableRow>
		);
	},
);

interface ArtistSearchTableBodyProps {
	store: ArtistSearchStore;
}

const ArtistSearchTableBody = observer(
	({ store }: ArtistSearchTableBodyProps): React.ReactElement => {
		const { t } = useTranslation();

		return store.artists.length === 0 ? (
			<TableEmptyBody
				noItemsMessage={
					store.loading
						? t('shared.loading')
						: t('shared.noItemsFound')
				}
				colSpan={2}
			/>
		) : (
			<EuiTableBody>
				{store.artists.map((artist) => (
					<ArtistSearchTableRow
						store={store}
						artist={artist}
						key={artist.id}
					/>
				))}
			</EuiTableBody>
		);
	},
);

interface ArtistSearchTableProps {
	store: ArtistSearchStore;
}

export const ArtistSearchTable = observer(
	({ store }: ArtistSearchTableProps): React.ReactElement => {
		return (
			<>
				<EuiTable
					className={classNames({
						'euiBasicTable-loading': store.loading,
					})}
				>
					<ArtistSearchTableHeader />
					<ArtistSearchTableBody store={store} />
				</EuiTable>

				<EuiSpacer size="m" />

				<Pagination store={store.pagination} />
			</>
		);
	},
);
