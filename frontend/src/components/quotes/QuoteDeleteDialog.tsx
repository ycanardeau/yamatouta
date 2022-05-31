import { EuiConfirmModal } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IQuoteObject } from '../../dto/IQuoteObject';
import { QuoteDeleteStore } from '../../stores/quotes/QuoteDeleteStore';

interface QuoteDeleteDialogProps {
	quote: IQuoteObject;
	onClose: () => void;
	onSuccess: () => void;
}

export const QuoteDeleteDialog = observer(
	({
		quote,
		onClose,
		onSuccess,
	}: QuoteDeleteDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(() => new QuoteDeleteStore(quote));

		return (
			<EuiConfirmModal
				title={t('quotes.deleteQuote')}
				onCancel={onClose}
				onConfirm={async (): Promise<void> => {
					await store.submit();

					onClose();
					onSuccess();
				}}
				cancelButtonText={t('shared.cancel')}
				confirmButtonText={t('quotes.deleteQuote')}
				buttonColor="danger"
				defaultFocusedButton="confirm"
				confirmButtonDisabled={!store.isValid || store.submitting}
			>
				{t('quotes.deleteDialogSubtitle')}
			</EuiConfirmModal>
		);
	},
);
