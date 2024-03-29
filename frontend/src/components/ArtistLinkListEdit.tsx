import { ArtistComboBox } from '@/components/artists/ArtistComboBox';
import { LinkType } from '@/models/LinkType';
import {
	ArtistLinkEditStore,
	ArtistLinkListEditStore,
} from '@/stores/ArtistLinkListEditStore';
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
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

interface ArtistLinkEditProps {
	artistLinkListEditStore: ArtistLinkListEditStore;
	store: ArtistLinkEditStore;
	allowedLinkTypes: LinkType[];
}

const ArtistLinkEdit = observer(
	({
		artistLinkListEditStore,
		store,
		allowedLinkTypes,
	}: ArtistLinkEditProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<EuiTableRow hasActions={true}>
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
						tabIndex={-1}
					/>
				</EuiTableRowCell>
			</EuiTableRow>
		);
	},
);

interface ArtistLinkListEditProps {
	store: ArtistLinkListEditStore;
	allowedLinkTypes: LinkType[];
}

export const ArtistLinkListEdit = observer(
	({
		store,
		allowedLinkTypes,
	}: ArtistLinkListEditProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<>
				<EuiTable>
					<EuiTableHeader>
						<EuiTableHeaderCell>
							{t('shared.artist')}
						</EuiTableHeaderCell>
						<EuiTableHeaderCell>
							{t('links.linkType')}
						</EuiTableHeaderCell>
						<EuiTableHeaderCell width={32} />
					</EuiTableHeader>

					<EuiTableBody>
						{store.items.map((item, index) => (
							<ArtistLinkEdit
								artistLinkListEditStore={store}
								store={item}
								allowedLinkTypes={allowedLinkTypes}
								key={index}
							/>
						))}
					</EuiTableBody>
				</EuiTable>

				<EuiSpacer size="m" />

				<EuiButton
					onClick={(): void => {
						runInAction(() => {
							const artistLink = store.add();
							artistLink.setLinkType(allowedLinkTypes[0]);
						});
					}}
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
