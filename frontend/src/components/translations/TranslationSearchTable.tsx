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
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Highlighter from 'react-highlight-words';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ITranslationObject } from '../../dto/ITranslationObject';
import { Permission } from '../../models/Permission';
import { TranslationSortRule } from '../../models/translations/TranslationSortRule';
import { WordCategory } from '../../models/translations/WordCategory';
import { TranslationSearchStore } from '../../stores/translations/TranslationSearchStore';
import { Pagination } from '../Pagination';
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
					onSort={(): void =>
						store.setSort(
							store.sort === TranslationSortRule.HeadwordAsc
								? TranslationSortRule.HeadwordDesc
								: TranslationSortRule.HeadwordAsc,
						)
					}
					isSorted={
						store.sort === TranslationSortRule.HeadwordAsc ||
						store.sort === TranslationSortRule.HeadwordDesc
					}
					isSortAscending={
						store.sort === TranslationSortRule.HeadwordAsc
					}
				>
					{t('translations.headword')}
				</EuiTableHeaderCell>
				<EuiTableHeaderCell
					onSort={(): void =>
						store.setSort(
							store.sort === TranslationSortRule.YamatokotobaAsc
								? TranslationSortRule.YamatokotobaDesc
								: TranslationSortRule.YamatokotobaAsc,
						)
					}
					isSorted={
						store.sort === TranslationSortRule.YamatokotobaAsc ||
						store.sort === TranslationSortRule.YamatokotobaDesc
					}
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
						href={`/translations/${translation.id}`}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(`/translations/${translation.id}`);
						}}
					>
						{t('shared.viewBasicInfo')}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type={EditRegular} />}
						href={`/translations/${translation.id}/edit`}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(`/translations/${translation.id}/edit`);
						}}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.Translation_Update,
							)
						}
					>
						{t('shared.doEdit')}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type={HistoryRegular} />}
						href={`/translations/${translation.id}/revisions`}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(
								`/translations/${translation.id}/revisions`,
							);
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
							translationDeleteDialog.show();
						}}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.Translation_Delete,
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

		const searchWords = store.query.trim().split(/\s+/);

		return (
			<EuiTableRow hasActions={true}>
				<EuiTableRowCell
					mobileOptions={{
						header: t('translations.headword'),
						width: '100%',
					}}
				>
					{translation.headword.split(/\s/).map((part, index) => (
						<React.Fragment key={index}>
							{index > 0 && ' '}
							<EuiLink
								onClick={(
									e: React.MouseEvent<HTMLAnchorElement>,
								): void => {
									e.preventDefault();
									runInAction(() => {
										store.query = part;
										store.sort =
											TranslationSortRule.HeadwordAsc;
									});
								}}
							>
								<HighlightedText
									text={part}
									searchWords={searchWords}
								/>
							</EuiLink>
						</React.Fragment>
					))}
					{translation.reading && (
						<small>
							【
							{translation.reading
								.split(/\s/)
								.map((part, index) => (
									<React.Fragment key={index}>
										{index > 0 && ' '}
										<HighlightedText
											text={part}
											searchWords={searchWords}
										/>
									</React.Fragment>
								))}
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
					{translation.yamatokotoba.split(/\s/).map((part, index) => (
						<React.Fragment key={index}>
							{index > 0 && ' '}
							<EuiLink
								onClick={(
									e: React.MouseEvent<HTMLAnchorElement>,
								): void => {
									e.preventDefault();
									runInAction(() => {
										store.query = part;
										store.sort =
											TranslationSortRule.YamatokotobaAsc;
									});
								}}
							>
								<HighlightedText
									text={part}
									searchWords={searchWords}
								/>
							</EuiLink>
						</React.Fragment>
					))}
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
		return (
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

export const TranslationSearchTable = ({
	store,
}: TranslationSearchTableProps): React.ReactElement => {
	return (
		<>
			<EuiTable>
				<TranslationSearchTableHeader store={store} />
				<TranslationSearchTableBody store={store} />
				<EuiTableFooter></EuiTableFooter>
			</EuiTable>

			<EuiSpacer size="m" />

			<Pagination store={store.pagination} />
		</>
	);
};
