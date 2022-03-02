import LaunchIcon from '@mui/icons-material/Launch';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
	IconButton,
	Link,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
} from '@mui/material';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Highlighter from 'react-highlight-words';
import { useTranslation } from 'react-i18next';

import { ITranslationObject } from '../../dto/translations/ITranslationObject';
import { TranslationSortRule } from '../../models/TranslationSortRule';
import { TranslationSearchStore } from '../../stores/translations/TranslationSearchStore';
import Pagination from '../Pagination';

interface TranslationMenuProps {
	translation: ITranslationObject;
}

const TranslationMenu = React.memo(
	({ translation }: TranslationMenuProps): React.ReactElement => {
		const { t } = useTranslation();

		const [anchorElTranslation, setAnchorElTranslation] = React.useState<
			(EventTarget & HTMLButtonElement) | undefined
		>();

		const handleOpenTranslationMenu = (
			e: React.MouseEvent<HTMLButtonElement>,
		): void => {
			setAnchorElTranslation(e.currentTarget);
		};

		const handleCloseTranslationMenu = (): void => {
			setAnchorElTranslation(undefined);
		};

		return (
			<>
				<IconButton size="small" onClick={handleOpenTranslationMenu}>
					<MoreHorizIcon fontSize="small" />
				</IconButton>
				<Menu
					anchorEl={anchorElTranslation}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					open={Boolean(anchorElTranslation)}
					onClose={handleCloseTranslationMenu}
				>
					<MenuItem
						onClick={handleCloseTranslationMenu}
						component="a"
						href={`https://inishienomanabi.net/translations/${translation.id}/view`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<ListItemIcon>
							<LaunchIcon fontSize="small" />
						</ListItemIcon>
						<ListItemText>
							{t('translations.viewOnInishienomanabi')}
						</ListItemText>
					</MenuItem>
				</Menu>
			</>
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
			<TableRow hover>
				<TableCell>
					{translation.headword.split(/\s/).map((part, index) => (
						<React.Fragment key={index}>
							{index > 0 && ' '}
							<Link
								/* TODO: component={RouterLink}
								to={`/words/${encodeURIComponent(
									part,
								)}/yamato-kotoba`} */
								href="#"
								onClick={(e): void => {
									e.preventDefault();

									runInAction(() => {
										store.query = part;
										store.sort =
											TranslationSortRule.HeadwordAsc;
									});
								}}
								underline="hover"
							>
								<HighlightedText
									text={part}
									searchWords={searchWords}
								/>
							</Link>
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
					{translation.category && (
						<>
							{' '}
							<small>
								{`{${t(
									`wordCategoryNames.${translation.category}`,
								)}}`}
							</small>
						</>
					)}
				</TableCell>
				<TableCell>
					{translation.yamatokotoba.split(/\s/).map((part, index) => (
						<React.Fragment key={index}>
							{index > 0 && ' '}
							<Link
								/* TODO: component={RouterLink}
								to={`/words/${encodeURIComponent(
									part,
								)}/headwords`} */
								href="#"
								onClick={(e): void => {
									e.preventDefault();

									runInAction(() => {
										store.query = part;
										store.sort =
											TranslationSortRule.YamatokotobaAsc;
									});
								}}
								underline="hover"
							>
								<HighlightedText
									text={part}
									searchWords={searchWords}
								/>
							</Link>
						</React.Fragment>
					))}
				</TableCell>
				<TableCell padding="checkbox">
					<TranslationMenu translation={translation} />
				</TableCell>
			</TableRow>
		);
	},
);

interface TranslationSearchTableProps {
	store: TranslationSearchStore;
}

const TranslationSearchTable = observer(
	({ store }: TranslationSearchTableProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<>
				<Pagination store={store.paginationStore} />

				<TableContainer component={Paper}>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell sx={{ width: '50%' }}>
									<TableSortLabel
										active={
											store.sort ===
												TranslationSortRule.HeadwordAsc ||
											store.sort ===
												TranslationSortRule.HeadwordDesc
										}
										direction={
											store.sort ===
											TranslationSortRule.HeadwordDesc
												? 'desc'
												: 'asc'
										}
										onClick={(): void =>
											store.setSort(
												store.sort ===
													TranslationSortRule.HeadwordAsc
													? TranslationSortRule.HeadwordDesc
													: TranslationSortRule.HeadwordAsc,
											)
										}
									>
										{t('translations.headword')}
									</TableSortLabel>
								</TableCell>
								<TableCell sx={{ width: '50%' }}>
									<TableSortLabel
										active={
											store.sort ===
												TranslationSortRule.YamatokotobaAsc ||
											store.sort ===
												TranslationSortRule.YamatokotobaDesc
										}
										direction={
											store.sort ===
											TranslationSortRule.YamatokotobaDesc
												? 'desc'
												: 'asc'
										}
										onClick={(): void =>
											store.setSort(
												store.sort ===
													TranslationSortRule.YamatokotobaAsc
													? TranslationSortRule.YamatokotobaDesc
													: TranslationSortRule.YamatokotobaAsc,
											)
										}
									>
										{t('translations.yamatokotoba')}
									</TableSortLabel>
								</TableCell>
								<TableCell />
							</TableRow>
						</TableHead>

						<TableBody>
							{store.translations.map((translation) => (
								<TranslationSearchTableRow
									key={translation.id}
									store={store}
									translation={translation}
								/>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				<Pagination store={store.paginationStore} />
			</>
		);
	},
);

export default TranslationSearchTable;
