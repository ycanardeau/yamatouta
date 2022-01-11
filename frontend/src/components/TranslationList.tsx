import {
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
			<TableRow>
				<TableCell>
					{translation.headword}
					{translation.reading && (
						<small>【{translation.reading}】</small>
					)}
				</TableCell>
				<TableCell>{translation.yamatokotoba}</TableCell>
				<TableCell>
					{translation.category &&
						t(`wordCategoryNames.${translation.category}`)}
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
							<TableCell>{t('translations.headword')}</TableCell>
							<TableCell>
								{t('translations.yamatokotoba')}
							</TableCell>
							<TableCell>{t('translations.category')}</TableCell>
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
