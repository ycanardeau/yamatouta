import {
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ITranslationObject } from '../dto/translations/ITranslationObject';

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
}

const TranslationList = React.memo(
	({ translations }: TranslationListProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<TableContainer component={Paper}>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell sx={{ width: '50%' }}>
								{t('translations.headword')}
							</TableCell>
							<TableCell sx={{ width: '50%' }}>
								{t('translations.yamatokotoba')}
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
