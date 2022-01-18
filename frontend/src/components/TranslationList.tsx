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
import { useTranslation } from 'react-i18next';

import { ITranslationObject } from '../dto/translations/ITranslationObject';
import { TranslationSortRule } from '../models/TranslationSortRule';

interface TranslationListItemProps {
	translation: ITranslationObject;
}

const TranslationListItem = React.memo(
	({ translation }: TranslationListItemProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<TableRow hover>
				<TableCell>
					<Link
						/* TODO: component={RouterLink}
						to={`/words/${encodeURIComponent(
							translation.headword,
						)}/yamato-kotoba`} */
						href="#"
						onClick={(e): void => e.preventDefault()}
						underline="hover"
					>
						{translation.headword}
					</Link>
					{translation.reading && (
						<small>【{translation.reading}】</small>
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
					<Link
						/* TODO: component={RouterLink}
						to={`/words/${encodeURIComponent(
							translation.yamatokotoba,
						)}/headwords`} */
						href="#"
						onClick={(e): void => e.preventDefault()}
						underline="hover"
					>
						{translation.yamatokotoba}
					</Link>
				</TableCell>
			</TableRow>
		);
	},
);

interface TranslationListProps {
	translations: ITranslationObject[];
	sort: TranslationSortRule;
	onSortChange: (sort: TranslationSortRule) => void;
}

const TranslationList = React.memo(
	({
		translations,
		sort,
		onSortChange,
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
							/>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		);
	},
);

export default TranslationList;
