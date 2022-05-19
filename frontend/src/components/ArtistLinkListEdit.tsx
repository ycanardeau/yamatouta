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
	ArtistLinkEditStore,
	ArtistLinkListEditStore,
} from '../stores/ArtistLinkListEditStore';
import LinkTypeComboBox from './LinkTypeComboBox';
import ArtistComboBox from './artists/ArtistComboBox';

interface ArtistLinkEditProps {
	artistLinkListEditStore: ArtistLinkListEditStore;
	store: ArtistLinkEditStore;
	entryType: EntryType;
}

const ArtistLinkEdit = observer(
	({
		artistLinkListEditStore,
		store,
		entryType,
	}: ArtistLinkEditProps): React.ReactElement => {
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
						relatedEntryType={EntryType.Artist}
					/>
				</EuiTableRowCell>
				<EuiTableRowCell
					textOnly={false}
					mobileOptions={{
						header: t('shared.artist'),
						width: '100%',
					}}
				>
					<ArtistComboBox store={store.relatedArtist} />
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
							artistLinkListEditStore.remove(store)
						}
						aria-label={t(`shared.remove`)}
					/>
				</EuiTableRowCell>
			</EuiTableRow>
		);
	},
);

interface ArtistLinkListEditProps {
	store: ArtistLinkListEditStore;
	entryType: EntryType;
}

const ArtistLinkListEdit = observer(
	({ store, entryType }: ArtistLinkListEditProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<>
				<EuiTable>
					<EuiTableHeader>
						<EuiTableHeaderCell>
							{t('links.linkType')}
						</EuiTableHeaderCell>
						<EuiTableHeaderCell>
							{t('shared.artist')}
						</EuiTableHeaderCell>
						<EuiTableHeaderCell width={32} />
					</EuiTableHeader>

					<EuiTableBody>
						{store.items.map((item, index) => (
							<ArtistLinkEdit
								artistLinkListEditStore={store}
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

export default ArtistLinkListEdit;
