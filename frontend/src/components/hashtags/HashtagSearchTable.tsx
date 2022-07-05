import {
	EuiSpacer,
	EuiTable,
	EuiTableBody,
	EuiTableHeader,
	EuiTableHeaderCell,
	EuiTableRow,
	EuiTableRowCell,
} from '@elastic/eui';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IHashtagObject } from '../../dto/IHashtagObject';
import { HashtagSortRule } from '../../models/hashtags/HashtagSortRule';
import { HashtagSearchStore } from '../../stores/hashtags/HashtagSearchStore';
import { Link } from '../Link';
import { Pagination } from '../Pagination';
import { TableEmptyBody } from '../TableEmptyBody';

interface HashtagSearchTableHeaderProps {
	store: HashtagSearchStore;
}

const HashtagSearchTableHeader = observer(
	({ store }: HashtagSearchTableHeaderProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<EuiTableHeader>
				<EuiTableHeaderCell
					onSort={store.toggleSortByName}
					isSorted={store.isSortedByName}
					isSortAscending={store.sort === HashtagSortRule.NameAsc}
				>
					{t('hashtags.name')}
				</EuiTableHeaderCell>
				<EuiTableHeaderCell
					onSort={store.toggleSortByReferenceCount}
					isSorted={store.isSortedByReferenceCount}
					isSortAscending={
						store.sort === HashtagSortRule.ReferenceCountAsc
					}
					align="right"
				>
					{t('hashtags.referenceCount')}
				</EuiTableHeaderCell>
			</EuiTableHeader>
		);
	},
);

interface HashtagSearchTableRowProps {
	hashtag: IHashtagObject;
}

const HashtagSearchTableRow = React.memo(
	({ hashtag }: HashtagSearchTableRowProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<EuiTableRow hasActions={true}>
				<EuiTableRowCell
					mobileOptions={{
						header: t('hashtags.name'),
					}}
				>
					<Link to={`/hashtags/${hashtag.name}/quotes`}>
						#{hashtag.name}
					</Link>
				</EuiTableRowCell>
				<EuiTableRowCell
					mobileOptions={{ header: t('hashtags.referenceCount') }}
					align="right"
				>
					{hashtag.referenceCount}
				</EuiTableRowCell>
			</EuiTableRow>
		);
	},
);

interface HashtagSearchTableBodyProps {
	store: HashtagSearchStore;
}

const HashtagSearchTableBody = observer(
	({ store }: HashtagSearchTableBodyProps): React.ReactElement => {
		const { t } = useTranslation();

		return store.hashtags.length === 0 ? (
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
				{store.hashtags.map((hashtag) => (
					<HashtagSearchTableRow
						hashtag={hashtag}
						key={hashtag.name}
					/>
				))}
			</EuiTableBody>
		);
	},
);

interface HashtagSearchTableProps {
	store: HashtagSearchStore;
}

export const HashtagSearchTable = observer(
	({ store }: HashtagSearchTableProps): React.ReactElement => {
		return (
			<>
				<EuiTable
					className={classNames({
						'euiBasicTable-loading': store.loading,
					})}
				>
					<HashtagSearchTableHeader store={store} />
					<HashtagSearchTableBody store={store} />
				</EuiTable>

				<EuiSpacer size="m" />

				<Pagination store={store.pagination} />
			</>
		);
	},
);
