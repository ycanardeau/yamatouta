import {
	EuiButton,
	EuiButtonEmpty,
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

import WebLinkListEdit from '../../components/WebLinkListEdit';
import ArtistComboBox from '../../components/artists/ArtistComboBox';
import { QuoteType } from '../../models/QuoteType';
import { QuoteDetailsStore } from '../../stores/quotes/QuoteDetailsStore';
import { QuoteEditStore } from '../../stores/quotes/QuoteEditStore';

interface QuoteEditProps {
	quoteDetailsStore: QuoteDetailsStore;
}

const QuoteEdit = observer(
	({ quoteDetailsStore }: QuoteEditProps): React.ReactElement => {
		const { t } = useTranslation();

		const quote = quoteDetailsStore.quote;

		const [store] = React.useState(() => new QuoteEditStore(quote));

		const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

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
						<ArtistComboBox store={store.artist} />
					</EuiFormRow>

					<EuiFormRow label={t('shared.externalLinks')} fullWidth>
						<WebLinkListEdit store={store.webLinks} />
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
