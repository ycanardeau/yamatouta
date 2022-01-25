import {
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
} from '@mui/material';
import React from 'react';
import Highlighter from 'react-highlight-words';
import { useTranslation } from 'react-i18next';

import { ITranslationObject } from '../dto/translations/ITranslationObject';
import { TranslationSortRule } from '../models/TranslationSortRule';

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

interface TranslationListItemProps {
	translation: ITranslationObject;
	searchWords: string[];
	onWordClick?: (event: { locale?: string; value: string }) => void;
}

const TranslationListItem = React.memo(
	({
		translation,
		searchWords,
		onWordClick,
	}: TranslationListItemProps): React.ReactElement => {
		const { t } = useTranslation();

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

									onWordClick?.({
										locale: translation.locale,
										value: translation.headword,
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

									onWordClick?.({
										locale: 'ojp',
										value: translation.yamatokotoba,
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
			</TableRow>
		);
	},
);

interface TranslationListProps {
	translations: ITranslationObject[];
	sort: TranslationSortRule;
	onSortChange: (sort: TranslationSortRule) => void;
	searchWords: string[];
	onWordClick?: (event: { locale?: string; value: string }) => void;
}

const TranslationList = React.memo(
	({
		translations,
		sort,
		onSortChange,
		searchWords,
		onWordClick,
	}: TranslationListProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<TableContainer component={Paper}>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell sx={{ width: '50%' }}>
								<TableSortLabel
									active={
										sort ===
											TranslationSortRule.HeadwordAsc ||
										sort ===
											TranslationSortRule.HeadwordDesc
									}
									direction={
										sort ===
										TranslationSortRule.HeadwordDesc
											? 'desc'
											: 'asc'
									}
									onClick={(): void =>
										onSortChange(
											sort ===
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
										sort ===
											TranslationSortRule.YamatokotobaAsc ||
										sort ===
											TranslationSortRule.YamatokotobaDesc
									}
									direction={
										sort ===
										TranslationSortRule.YamatokotobaDesc
											? 'desc'
											: 'asc'
									}
									onClick={(): void =>
										onSortChange(
											sort ===
												TranslationSortRule.YamatokotobaAsc
												? TranslationSortRule.YamatokotobaDesc
												: TranslationSortRule.YamatokotobaAsc,
										)
									}
								>
									{t('translations.yamatokotoba')}
								</TableSortLabel>
							</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{translations.map((translation) => (
							<TranslationListItem
								translation={translation}
								key={translation.id}
								searchWords={searchWords}
								onWordClick={onWordClick}
							/>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		);
	},
);

export default TranslationList;
