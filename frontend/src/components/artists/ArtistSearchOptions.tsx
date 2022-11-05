import { ArtistSortRule } from '@/models/artists/ArtistSortRule';
import { ArtistType } from '@/models/artists/ArtistType';
import { ArtistSearchStore } from '@/stores/artists/ArtistSearchStore';
import {
	EuiFieldSearch,
	EuiFlexGroup,
	EuiFlexItem,
	EuiFormControlLayout,
	EuiFormLabel,
	EuiSelect,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ArtistSearchOptionsProps {
	store: ArtistSearchStore;
}

export const ArtistSearchOptions = observer(
	({ store }: ArtistSearchOptionsProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<EuiFlexGroup gutterSize="m">
				<EuiFlexItem>
					<EuiFieldSearch
						compressed
						fullWidth
						placeholder={t('artists.search')}
						value={store.query}
						onChange={(e): void => store.setQuery(e.target.value)}
						onSearch={store.submit}
					/>
				</EuiFlexItem>

				<EuiFlexItem grow={false}>
					<EuiFormControlLayout
						compressed
						fullWidth
						prepend={
							<EuiFormLabel htmlFor="artistType">
								{t('artists.artistType')}
							</EuiFormLabel>
						}
					>
						<EuiSelect
							compressed
							id="artistType"
							options={[
								{
									value: '',
									text: t('shared.all'),
								},
								...Object.values(ArtistType).map((value) => ({
									value: value,
									text: t(`artistTypeNames.${value}`),
								})),
							]}
							value={store.artistType}
							onChange={(e): void =>
								store.setArtistType(
									e.target.value as ArtistType,
								)
							}
						/>
					</EuiFormControlLayout>
				</EuiFlexItem>

				<EuiFlexItem grow={false}>
					<EuiFormControlLayout
						compressed
						fullWidth
						prepend={
							<EuiFormLabel htmlFor="sort">
								{t('shared.sortBy')}
							</EuiFormLabel>
						}
					>
						<EuiSelect
							compressed
							id="sort"
							options={Object.values(ArtistSortRule).map(
								(value) => ({
									value: value,
									text: t(`artistSortRuleNames.${value}`),
								}),
							)}
							value={store.sort}
							onChange={(e): void =>
								store.setSort(e.target.value as ArtistSortRule)
							}
						/>
					</EuiFormControlLayout>
				</EuiFlexItem>
			</EuiFlexGroup>
		);
	},
);
