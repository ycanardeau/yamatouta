import { EuiConfirmModal } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IQuoteObject } from '../../dto/quotes/IQuoteObject';
import { DeleteQuoteDialogStore } from '../../stores/quotes/DeleteQuoteDialogStore';

interface DeleteQuoteDialogProps {
	quote: IQuoteObject;
	onClose: () => void;
	onSuccess: () => void;
}

const DeleteQuoteDialog = observer(
	({
		quote,
		onClose,
		onSuccess,
	}: DeleteQuoteDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(
			() => new DeleteQuoteDialogStore({ quote: quote }),
		);

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

export default DeleteQuoteDialog;