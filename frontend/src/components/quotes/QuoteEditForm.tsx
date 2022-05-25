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
import { IQuoteObject } from '../../dto/IQuoteObject';
import { QuoteType } from '../../models/quotes/QuoteType';
import { QuoteEditStore } from '../../stores/quotes/QuoteEditStore';

interface QuoteEditFormProps {
	quote?: IQuoteObject;
}

const QuoteEditForm = observer(
	({ quote }: QuoteEditFormProps): React.ReactElement => {
		const { t } = useTranslation();

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
						href={quote ? `/quotes/${quote.id}` : '/quotes'}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(quote ? `/quotes/${quote.id}` : '/quotes');
						}}
					>
						{t('shared.cancel')}
					</EuiButtonEmpty>
				</div>
			</>
		);
	},
);

export default QuoteEditForm;
