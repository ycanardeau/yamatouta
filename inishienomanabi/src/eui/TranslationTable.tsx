import { Page, Translation } from '@/data/database';
import Link from '@/eui/Link';
import {
	japaneseCaption,
	statusLabels,
	yamatokotobaCaption,
} from '@/shared/constants';
import {
	Criteria,
	EuiBadge,
	EuiBasicTable,
	EuiBasicTableColumn,
	EuiFlexGroup,
	EuiFlexItem,
	EuiText,
} from '@elastic/eui';
import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const columns: EuiBasicTableColumn<Translation>[] = [
	{
		field: 'reading',
		name: japaneseCaption,
		sortable: true,
		render: (_: string, t: Translation): React.ReactNode => (
			<EuiFlexGroup
				gutterSize="s"
				alignItems="center"
				responsive={false}
				wrap
			>
				{statusLabels[t.status] && (
					<EuiFlexItem grow={false}>
						<EuiBadge color="danger">
							{statusLabels[t.status]}
						</EuiBadge>
					</EuiFlexItem>
				)}
				<EuiFlexItem grow={false}>
					<Link to={`/translations/${t.id}/view`}>{t.japanese}</Link>
				</EuiFlexItem>
				{t.reading && (
					<EuiFlexItem grow={false}>
						<EuiText size="xs" color="subdued">
							{t.reading}
						</EuiText>
					</EuiFlexItem>
				)}
				{t.category && (
					<EuiFlexItem grow={false}>
						<EuiBadge color="hollow">{t.category}</EuiBadge>
					</EuiFlexItem>
				)}
			</EuiFlexGroup>
		),
	},
	{
		field: 'yamatokotoba',
		name: yamatokotobaCaption,
		sortable: true,
		render: (yamatokotoba: string): React.ReactNode => yamatokotoba,
	},
	{
		field: 'tags',
		name: 'タグ',
		render: (tags: string[]): React.ReactNode => (
			<EuiFlexGroup gutterSize="xs" responsive={false} wrap>
				{tags.map((tag) => (
					<EuiFlexItem key={tag} grow={false}>
						<EuiBadge>{tag}</EuiBadge>
					</EuiFlexItem>
				))}
			</EuiFlexGroup>
		),
	},
];

const TranslationTable = ({
	translations,
	page,
	pageSize,
	sort,
}: {
	translations: Translation[] | Page<Translation>;
	// Shows pagination and sorting, stored in the URL, when set.
	page?: number;
	pageSize?: number;
	sort?: 'ja' | 'ojp';
}): React.ReactElement => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [searchParams] = useSearchParams();

	const result = Array.isArray(translations)
		? { items: translations, totalCount: translations.length }
		: translations;

	return (
		<EuiBasicTable
			items={result.items}
			columns={columns}
			pagination={
				page !== undefined && pageSize !== undefined
					? {
							pageIndex: page - 1,
							pageSize,
							totalItemCount: result.totalCount,
							pageSizeOptions: [20, 50, 100, 200],
					  }
					: undefined
			}
			sorting={
				sort
					? {
							sort: {
								field:
									sort === 'ojp' ? 'yamatokotoba' : 'reading',
								direction: 'asc',
							},
					  }
					: undefined
			}
			onChange={({ page: p, sort: s }: Criteria<Translation>): void => {
				const params = new URLSearchParams(searchParams);
				if (p) {
					params.set('page', String(p.index + 1));
					params.set('pagesize', String(p.size));
				}
				if (s)
					params.set(
						'sort',
						s.field === 'yamatokotoba' ? 'ojp' : 'ja',
					);
				navigate(`${pathname}?${params}`);
			}}
		/>
	);
};

export default TranslationTable;
