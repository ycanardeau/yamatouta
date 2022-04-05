import {
	EuiLink,
	EuiSpacer,
	EuiTable,
	EuiTableBody,
	EuiTableHeader,
	EuiTableHeaderCell,
	EuiTableRow,
	EuiTableRowCell,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Avatar from '../../components/Avatar';
import Pagination from '../../components/Pagination';
import { ArtistSearchStore } from '../../stores/artists/ArtistSearchStore';

interface ArtistSearchTableProps {
	store: ArtistSearchStore;
}

const ArtistSearchTable = observer(
	({ store }: ArtistSearchTableProps): React.ReactElement => {
		const { t } = useTranslation();

		const navigate = useNavigate();

		return (
			<>
				<EuiTable>
					<EuiTableHeader>
						<EuiTableHeaderCell width={40} />
						<EuiTableHeaderCell>
							{t('artists.name')}
						</EuiTableHeaderCell>
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
									<EuiLink
										href={`/artists/${artist.id}`}
										onClick={(
											e: React.MouseEvent<HTMLAnchorElement>,
										): void => {
											e.preventDefault();
											navigate(`/artists/${artist.id}`);
										}}
									>
										{artist.name}
									</EuiLink>
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

export default ArtistSearchTable;
