import {
	EuiBadge,
	EuiButtonIcon,
	EuiContextMenuItem,
	EuiContextMenuPanel,
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
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Highlighter from 'react-highlight-words';
import { useTranslation } from 'react-i18next';

import { ITranslationObject } from '../../dto/translations/ITranslationObject';
import { TranslationSortRule } from '../../models/TranslationSortRule';
import { TranslationSearchStore } from '../../stores/translations/TranslationSearchStore';
import Pagination from '../Pagination';

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
	translation: ITranslationObject;
}

const TranslationPopover = ({
	translation,
}: TranslationPopoverProps): React.ReactElement => {
	const { t } = useTranslation();

	const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
	const togglePopover = (): void => setIsPopoverOpen(!isPopoverOpen);
	const closePopover = (): void => setIsPopoverOpen(false);

	return (
		<EuiPopover
			button={
				<EuiButtonIcon
					iconType="gear"
					size="s"
					color="text"
					onClick={togglePopover}
				/>
			}
			isOpen={isPopoverOpen}
			closePopover={closePopover}
			panelPaddingSize="none"
			anchorPosition="leftCenter"
		>
			<EuiContextMenuPanel
				items={[
					<EuiContextMenuItem
						icon="popout"
						href={`https://inishienomanabi.net/translations/${translation.id}/view`}
						target="_blank"
					>
						{t('translations.viewOnInishienomanabi')}
					</EuiContextMenuItem>,
				]}
			/>
		</EuiPopover>
	);
};

interface TranslationSearchTableProps {
	store: TranslationSearchStore;
}

const TranslationSearchTable = observer(
	({ store }: TranslationSearchTableProps): React.ReactElement => {
		const { t } = useTranslation();

		const searchWords = store.query.trim().split(/\s+/);

		return (
			<>
				<EuiTable>
					<EuiTableHeader>
						<EuiTableHeaderCell
							onSort={(): void =>
								store.setSort(
									store.sort ===
										TranslationSortRule.HeadwordAsc
										? TranslationSortRule.HeadwordDesc
										: TranslationSortRule.HeadwordAsc,
								)
							}
							isSorted={
								store.sort ===
									TranslationSortRule.HeadwordAsc ||
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
									store.sort ===
										TranslationSortRule.YamatokotobaAsc
										? TranslationSortRule.YamatokotobaDesc
										: TranslationSortRule.YamatokotobaAsc,
								)
							}
							isSorted={
								store.sort ===
									TranslationSortRule.YamatokotobaAsc ||
								store.sort ===
									TranslationSortRule.YamatokotobaDesc
							}
							isSortAscending={
								store.sort ===
								TranslationSortRule.YamatokotobaAsc
							}
						>
							{t('translations.yamatokotoba')}
						</EuiTableHeaderCell>
						<EuiTableHeaderCell>
							{t('translations.category')}
						</EuiTableHeaderCell>
						<EuiTableHeaderCell width={32} />
					</EuiTableHeader>

					<EuiTableBody>
						{store.translations.map((translation) => (
							<EuiTableRow key={translation.id} hasActions={true}>
								<EuiTableRowCell
									mobileOptions={{
										header: t('translations.headword'),
									}}
								>
									{translation.headword
										.split(/\s/)
										.map((part, index) => (
											<React.Fragment key={index}>
												{index > 0 && ' '}
												<EuiLink
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
												>
													<HighlightedText
														text={part}
														searchWords={
															searchWords
														}
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
															searchWords={
																searchWords
															}
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
									}}
								>
									{translation.yamatokotoba
										.split(/\s/)
										.map((part, index) => (
											<React.Fragment key={index}>
												{index > 0 && ' '}
												<EuiLink
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
												>
													<HighlightedText
														text={part}
														searchWords={
															searchWords
														}
													/>
												</EuiLink>
											</React.Fragment>
										))}
								</EuiTableRowCell>
								<EuiTableRowCell
									mobileOptions={{
										header: t('translations.category'),
									}}
								>
									{translation.category && (
										<EuiBadge color="default">
											{t(
												`wordCategoryNames.${translation.category}`,
											)}
										</EuiBadge>
									)}
								</EuiTableRowCell>
								<EuiTableRowCell
									textOnly={false}
									hasActions={true}
									align="right"
								>
									<TranslationPopover
										translation={translation}
									/>
								</EuiTableRowCell>
							</EuiTableRow>
						))}
					</EuiTableBody>

					<EuiTableFooter></EuiTableFooter>
				</EuiTable>

				<EuiSpacer size="m" />

				<Pagination store={store.paginationStore} />
			</>
		);
	},
);

export default TranslationSearchTable;
