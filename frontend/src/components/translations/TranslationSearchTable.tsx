import {
	EuiBadge,
	EuiButtonIcon,
	EuiContextMenuItem,
	EuiContextMenuPanel,
	EuiHorizontalRule,
	EuiIcon,
	EuiLink,
	EuiPopover,
	EuiSpacer,
	EuiTable,
	EuiTableBody,
	EuiTableFooter,
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
	OpenRegular,
} from '@fluentui/react-icons';
import classNames from 'classnames';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Highlighter from 'react-highlight-words';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ITranslationObject } from '../../dto/ITranslationObject';
import { EntryUrlMapper } from '../../models/EntryUrlMapper';
import { Permission } from '../../models/Permission';
import { TranslationSortRule } from '../../models/translations/TranslationSortRule';
import { WordCategory } from '../../models/translations/WordCategory';
import { TranslationSearchStore } from '../../stores/translations/TranslationSearchStore';
import { Pagination } from '../Pagination';
import { TableEmptyBody } from '../TableEmptyBody';
import { useAuth } from '../useAuth';
import { useDialog } from '../useDialog';
import { TranslationDeleteDialog } from './TranslationDeleteDialog';

interface TranslationSearchTableHeaderProps {
	store: TranslationSearchStore;
}

const TranslationSearchTableHeader = observer(
	({ store }: TranslationSearchTableHeaderProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<EuiTableHeader>
				<EuiTableHeaderCell
					onSort={store.toggleSortHeadword}
					isSorted={store.isSortedByHeadword}
					isSortAscending={
						store.sort === TranslationSortRule.HeadwordAsc
					}
				>
					{t('translations.headword')}
				</EuiTableHeaderCell>
				<EuiTableHeaderCell
					onSort={store.toggleSortYamatokotoba}
					isSorted={store.isSortedByYamatokotoba}
					isSortAscending={
						store.sort === TranslationSortRule.YamatokotobaAsc
					}
				>
					{t('translations.yamatokotoba')}
				</EuiTableHeaderCell>
				<EuiTableHeaderCell>
					{t('translations.category')}
				</EuiTableHeaderCell>
				<EuiTableHeaderCell width={32} />
			</EuiTableHeader>
		);
	},
);

interface HighlightProps {
	children: React.ReactNode;
}

const Highlight = ({ children }: HighlightProps): React.ReactElement => {
	return <strong className="highlighted-text">{children}</strong>;
};

interface HighlightedTextProps {
	text: string;
	searchWords: string[];
}

const HighlightedText = React.memo(
	({ text, searchWords }: HighlightedTextProps): React.ReactElement => {
		return (
			<Highlighter
				searchWords={searchWords}
				autoEscape={true}
				textToHighlight={text}
				highlightTag={Highlight}
			/>
		);
	},
);

interface TranslationPopoverProps {
	store: TranslationSearchStore;
	translation: ITranslationObject;
}

const TranslationPopover = ({
	store,
	translation,
}: TranslationPopoverProps): React.ReactElement => {
	const { t } = useTranslation();

	const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
	const togglePopover = (): void => setIsPopoverOpen(!isPopoverOpen);
	const closePopover = (): void => setIsPopoverOpen(false);

	const navigate = useNavigate();

	const translationDeleteDialog = useDialog();

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
						href={EntryUrlMapper.details(translation)}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(EntryUrlMapper.details(translation));
						}}
					>
						{t('shared.viewBasicInfo')}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type={EditRegular} />}
						href={EntryUrlMapper.edit(translation)}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(EntryUrlMapper.edit(translation));
						}}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.UpdateTranslations,
							)
						}
					>
						{t('shared.doEdit')}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type={HistoryRegular} />}
						href={EntryUrlMapper.revisions(translation)}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(EntryUrlMapper.revisions(translation));
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
							translationDeleteDialog.show();
						}}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.DeleteTranslations,
							)
						}
					>
						{t('shared.delete')}
					</EuiContextMenuItem>
					{new Date(translation.createdAt) <
						new Date('2022-03-16') && (
						<>
							<EuiHorizontalRule margin="none" />
							<EuiContextMenuItem
								icon={<EuiIcon type={OpenRegular} />}
								href={`https://inishienomanabi.net/translations/${translation.id}/view`}
								onClick={closePopover}
								target="_blank"
							>
								{t('translations.viewOnInishienomanabi')}
							</EuiContextMenuItem>
						</>
					)}
				</EuiContextMenuPanel>
			</EuiPopover>

			{translationDeleteDialog.visible && (
				<TranslationDeleteDialog
					translation={translation}
					onClose={translationDeleteDialog.close}
					onSuccess={async (): Promise<void> => {
						await store.updateResults(true);
					}}
				/>
			)}
		</>
	);
};

interface WordLinkProps {
	store: TranslationSearchStore;
	part: string;
	sort: TranslationSortRule;
}

const WordLink = observer(
	({ store, part, sort }: WordLinkProps): React.ReactElement => {
		return (
			<EuiLink
				onClick={(e: React.MouseEvent<HTMLAnchorElement>): void => {
					e.preventDefault();
					runInAction(() => {
						store.query = part;
						store.sort = sort;
					});
				}}
			>
				<HighlightedText text={part} searchWords={store.searchWords} />
			</EuiLink>
		);
	},
);

interface WordLinkListProps {
	store: TranslationSearchStore;
	parts: string[];
	sort?: TranslationSortRule;
}

const WordLinkList = observer(
	({ store, parts, sort }: WordLinkListProps): React.ReactElement => {
		return (
			<>
				{parts.map((part, index) => (
					<React.Fragment key={index}>
						{index > 0 && ' '}
						{sort ? (
							<WordLink store={store} part={part} sort={sort} />
						) : (
							<HighlightedText
								text={part}
								searchWords={store.searchWords}
							/>
						)}
					</React.Fragment>
				))}
			</>
		);
	},
);

interface TranslationSearchTableRowProps {
	store: TranslationSearchStore;
	translation: ITranslationObject;
}

const TranslationSearchTableRow = observer(
	({
		store,
		translation,
	}: TranslationSearchTableRowProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<EuiTableRow hasActions={true}>
				<EuiTableRowCell
					mobileOptions={{
						header: t('translations.headword'),
						width: '100%',
					}}
				>
					<WordLinkList
						store={store}
						parts={translation.headword.split(/\s/)}
						sort={TranslationSortRule.HeadwordAsc}
					/>
					{translation.reading && (
						<small>
							【
							<WordLinkList
								store={store}
								parts={translation.reading.split(/\s/)}
							/>
							】
						</small>
					)}
				</EuiTableRowCell>
				<EuiTableRowCell
					mobileOptions={{
						header: t('translations.yamatokotoba'),
						width: '100%',
					}}
				>
					<WordLinkList
						store={store}
						parts={translation.yamatokotoba.split(/\s/)}
						sort={TranslationSortRule.YamatokotobaAsc}
					/>
				</EuiTableRowCell>
				<EuiTableRowCell
					mobileOptions={{
						header: t('translations.category'),
						width: '100%',
					}}
				>
					{translation.category !== WordCategory.Unspecified && (
						<EuiBadge color="default">
							{t(`wordCategoryNames.${translation.category}`)}
						</EuiBadge>
					)}
				</EuiTableRowCell>
				<EuiTableRowCell
					textOnly={false}
					hasActions={true}
					align="right"
				>
					<TranslationPopover
						store={store}
						translation={translation}
					/>
				</EuiTableRowCell>
			</EuiTableRow>
		);
	},
);

interface TranslationSearchTableBodyProps {
	store: TranslationSearchStore;
}

const TranslationSearchTableBody = observer(
	({ store }: TranslationSearchTableBodyProps): React.ReactElement => {
		const { t } = useTranslation();

		return store.translations.length === 0 ? (
			<TableEmptyBody
				noItemsMessage={
					store.loading
						? t('shared.loading')
						: t('shared.noItemsFound')
				}
				colSpan={4}
			/>
		) : (
			<EuiTableBody>
				{store.translations.map((translation) => (
					<TranslationSearchTableRow
						store={store}
						translation={translation}
						key={translation.id}
					/>
				))}
			</EuiTableBody>
		);
	},
);

interface TranslationSearchTableProps {
	store: TranslationSearchStore;
}

export const TranslationSearchTable = observer(
	({ store }: TranslationSearchTableProps): React.ReactElement => {
		return (
			<>
				<EuiTable
					className={classNames({
						'euiBasicTable-loading': store.loading,
					})}
				>
					<TranslationSearchTableHeader store={store} />
					<TranslationSearchTableBody store={store} />
					<EuiTableFooter></EuiTableFooter>
				</EuiTable>

				<EuiSpacer size="m" />

				<Pagination store={store.pagination} />
			</>
		);
	},
);
