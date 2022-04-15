import {
	EuiButton,
	EuiButtonEmpty,
	EuiComboBox,
	EuiComboBoxOptionOption,
	EuiForm,
	EuiFormRow,
	EuiSelect,
	EuiSpacer,
	EuiTextArea,
	useGeneratedHtmlId,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { listArtists } from '../../api/ArtistApi';
import { QuoteType } from '../../models/QuoteType';
import { EditQuoteDialogStore } from '../../stores/quotes/EditQuoteDialogStore';
import { QuoteDetailsStore } from '../../stores/quotes/QuoteDetailsStore';

interface QuoteEditProps {
	quoteDetailsStore: QuoteDetailsStore;
}

const QuoteEdit = observer(
	({ quoteDetailsStore }: QuoteEditProps): React.ReactElement => {
		const { t } = useTranslation();

		const quote = quoteDetailsStore.quote;

		const [store] = React.useState(() => new EditQuoteDialogStore(quote));

		const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

		const [options, setOptions] = React.useState<EuiComboBoxOptionOption[]>(
			[],
		);

		const handleSearchChange = React.useCallback(
			async (searchValue: string): Promise<void> => {
				const artists = await listArtists({
					pagination: {
						offset: 0,
						limit: 20,
						getTotalCount: false,
					},
					query: searchValue,
				});

				setOptions(
					artists.items.map((artist) => ({
						key: artist.id.toString(),
						label: artist.name,
					})),
				);
			},
			[],
		);

		React.useEffect(() => {
			handleSearchChange('');
		}, [handleSearchChange]);

		const navigate = useNavigate();

		return (
			<>
				<EuiForm
					id={modalFormId}
					component="form"
					onSubmit={async (e): Promise<void> => {
						e.preventDefault();

						const quote = await store.submit();

						quoteDetailsStore.setQuote(quote);
						navigate(`/quotes/${quote.id}`);
					}}
				>
					<EuiFormRow label={t('quotes.quote')}>
						<EuiTextArea
							compressed
							name="text"
							value={store.text}
							onChange={(e): void =>
								store.setText(e.target.value)
							}
							rows={5}
						/>
					</EuiFormRow>

					<EuiFormRow label={t('quotes.quoteType')}>
						<EuiSelect
							compressed
							name="quoteType"
							options={Object.values(QuoteType).map((value) => ({
								value: value,
								text: t(`quoteTypeNames.${value}`),
							}))}
							value={store.quoteType ?? ''}
							onChange={(e): void =>
								store.setQuoteType(e.target.value as QuoteType)
							}
						/>
					</EuiFormRow>

					<EuiFormRow label={t('quotes.artist')}>
						<EuiComboBox
							compressed
							placeholder={t('quotes.selectArtist')}
							singleSelection={{ asPlainText: true }}
							options={options}
							selectedOptions={
								store.artist.entry
									? [
											{
												key: store.artist.entry.id.toString(),
												label: store.artist.entry.name,
											},
									  ]
									: []
							}
							onChange={async (
								selectedOptions,
							): Promise<void> => {
								await store.artist.loadEntryById(
									Number(selectedOptions[0]?.key),
								);
							}}
							onSearchChange={handleSearchChange}
						/>
					</EuiFormRow>
				</EuiForm>

				<EuiSpacer />

				<div>
					<EuiButton
						size="s"
						type="submit"
						form={modalFormId}
						disabled={!store.isValid || store.submitting}
					>
						{quote ? t('quotes.editQuote') : t('quotes.addQuote')}
					</EuiButton>
					&emsp;
					<EuiButtonEmpty
						size="s"
						href={`/quotes/${quote.id}`}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/quotes/${quote.id}`);
						}}
					>
						{t('shared.cancel')}
					</EuiButtonEmpty>
				</div>
			</>
		);
	},
);

export default QuoteEdit;
