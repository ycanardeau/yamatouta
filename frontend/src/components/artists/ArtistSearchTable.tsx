import { Avatar } from '@/components/Avatar';
import { Link } from '@/components/Link';
import { Pagination } from '@/components/Pagination';
import { TableEmptyBody } from '@/components/TableEmptyBody';
import { ArtistDeleteDialog } from '@/components/artists/ArtistDeleteDialog';
import { useAuth } from '@/components/useAuth';
import { useDialog } from '@/components/useDialog';
import { IArtistDto } from '@/dto/IArtistDto';
import { EntryUrlMapper } from '@/models/EntryUrlMapper';
import { Permission } from '@/models/Permission';
import { ArtistSearchStore } from '@/stores/artists/ArtistSearchStore';
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
	artist: IArtistDto;
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
						href={EntryUrlMapper.details(artist)}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(EntryUrlMapper.details(artist));
						}}
					>
						{t('shared.viewBasicInfo')}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type={EditRegular} />}
						href={EntryUrlMapper.edit(artist)}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(EntryUrlMapper.edit(artist));
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
						href={EntryUrlMapper.revisions(artist)}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(EntryUrlMapper.revisions(artist));
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
	artist: IArtistDto;
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
						<Link to={EntryUrlMapper.details(artist)}>
							{artist.name}
						</Link>
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
