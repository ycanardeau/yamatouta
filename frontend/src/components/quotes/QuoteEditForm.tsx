import { MarkdownEditor } from '@/components/MarkdownEditor';
import { WebLinkListEdit } from '@/components/WebLinkListEdit';
import { WorkLinkListEdit } from '@/components/WorkLinkListEdit';
import { ArtistComboBox } from '@/components/artists/ArtistComboBox';
import { QuoteEditDto } from '@/dto/QuoteEditDto';
import { EntryType } from '@/models/EntryType';
import { EntryUrlMapper } from '@/models/EntryUrlMapper';
import { workLinkTypes } from '@/models/LinkType';
import { QuoteType } from '@/models/quotes/QuoteType';
import { QuoteEditStore } from '@/stores/quotes/QuoteEditStore';
import {
	EuiButton,
	EuiButtonEmpty,
	EuiForm,
	EuiFormRow,
	EuiSelect,
	EuiSpacer,
	useGeneratedHtmlId,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface QuoteEditFormProps {
	quote?: QuoteEditDto;
}

export const QuoteEditForm = observer(
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

						navigate(EntryUrlMapper.details(quote));
					}}
				>
					<EuiFormRow label={t('quotes.quote')} fullWidth>
						<MarkdownEditor
							aria-label={t('quotes.quote')}
							value={store.text}
							onChange={(value): void => store.setText(value)}
							readOnly={store.submitting}
							initialViewMode="editing"
							markdownFormatProps={{ textSize: 's' }}
						/>
					</EuiFormRow>

					<EuiFormRow label={t('quotes.quoteType')}>
						<EuiSelect
							compressed
							name="quoteType"
							options={[{ value: '', text: '' }].concat(
								Object.values(QuoteType).map((value) => ({
									value: value,
									text: t(`quoteTypeNames.${value}`),
								})),
							)}
							value={store.quoteType}
							onChange={(e): void =>
								store.setQuoteType(e.target.value as QuoteType)
							}
						/>
					</EuiFormRow>

					<EuiFormRow label={t('shared.artist')}>
						<ArtistComboBox store={store.artist} />
					</EuiFormRow>

					<EuiFormRow label={t('shared.externalLinks')} fullWidth>
						<WebLinkListEdit store={store.webLinks} />
					</EuiFormRow>

					<EuiFormRow label={t('shared.workLinks')} fullWidth>
						<WorkLinkListEdit
							store={store.workLinks}
							allowedLinkTypes={workLinkTypes[EntryType.Quote]}
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
						href={quote ? EntryUrlMapper.details(quote) : '/quotes'}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(
								quote
									? EntryUrlMapper.details(quote)
									: '/quotes',
							);
						}}
					>
						{t('shared.cancel')}
					</EuiButtonEmpty>
				</div>
			</>
		);
	},
);
