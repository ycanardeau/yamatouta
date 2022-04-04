import {
	EuiButton,
	EuiButtonEmpty,
	EuiForm,
	EuiFormRow,
	EuiModal,
	EuiModalBody,
	EuiModalFooter,
	EuiModalHeader,
	EuiModalHeaderTitle,
	EuiSelect,
	EuiTextArea,
	useGeneratedHtmlId,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IQuoteObject } from '../../dto/quotes/IQuoteObject';
import { QuoteType } from '../../models/QuoteType';
import { EditQuoteDialogStore } from '../../stores/quotes/EditQuoteDialogStore';

interface EditQuoteDialogProps {
	quote?: IQuoteObject;
	onClose: () => void;
	onSuccess: (quote: IQuoteObject) => void;
}

const EditQuoteDialog = observer(
	({
		quote,
		onClose,
		onSuccess,
	}: EditQuoteDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(
			() => new EditQuoteDialogStore({ quote: quote }),
		);

		const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

		return (
			<EuiModal onClose={onClose} initialFocus="[name=text]">
				<EuiModalHeader>
					<EuiModalHeaderTitle>
						<h1>
							{quote
								? t('quotes.editQuote')
								: t('quotes.addQuote')}
						</h1>
					</EuiModalHeaderTitle>
				</EuiModalHeader>

				<EuiModalBody>
					<EuiForm
						id={modalFormId}
						component="form"
						onSubmit={async (e): Promise<void> => {
							e.preventDefault();

							const quote = await store.submit();

							onClose();
							onSuccess(quote);
						}}
					>
						<EuiFormRow label={t('quotes.text')}>
							<EuiTextArea
								compressed
								name="name"
								value={store.text}
								onChange={(e): void =>
									store.setText(e.target.value)
								}
							/>
						</EuiFormRow>

						<EuiFormRow label={t('quotes.quoteType')}>
							<EuiSelect
								compressed
								name="quoteType"
								options={Object.values(QuoteType).map(
									(value) => ({
										value: value,
										text: t(`quoteTypeNames.${value}`),
									}),
								)}
								value={store.quoteType ?? ''}
								onChange={(e): void =>
									store.setQuoteType(
										e.target.value as QuoteType,
									)
								}
							/>
						</EuiFormRow>
					</EuiForm>
				</EuiModalBody>

				<EuiModalFooter>
					<EuiButtonEmpty size="s" onClick={onClose}>
						{t('shared.cancel')}
					</EuiButtonEmpty>

					<EuiButton
						size="s"
						type="submit"
						form={modalFormId}
						disabled={!store.isValid || store.submitting}
					>
						{quote ? t('quotes.editQuote') : t('quotes.addQuote')}
					</EuiButton>
				</EuiModalFooter>
			</EuiModal>
		);
	},
);

export default EditQuoteDialog;
