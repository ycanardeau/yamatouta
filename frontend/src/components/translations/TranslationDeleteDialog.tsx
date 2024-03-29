import { ITranslationDto } from '@/dto/ITranslationDto';
import { TranslationDeleteStore } from '@/stores/translations/TranslationDeleteStore';
import { EuiConfirmModal } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface TranslationDeleteDialogProps {
	translation: ITranslationDto;
	onClose: () => void;
	onSuccess: () => void;
}

export const TranslationDeleteDialog = observer(
	({
		translation,
		onClose,
		onSuccess,
	}: TranslationDeleteDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(
			() => new TranslationDeleteStore(translation),
		);

		return (
			<EuiConfirmModal
				title={t('translations.deleteWord')}
				onCancel={onClose}
				onConfirm={async (): Promise<void> => {
					await store.submit();

					onClose();
					onSuccess();
				}}
				cancelButtonText={t('shared.cancel')}
				confirmButtonText={t('translations.deleteWord')}
				buttonColor="danger"
				defaultFocusedButton="confirm"
				confirmButtonDisabled={!store.isValid || store.submitting}
			>
				{t('translations.deleteDialogSubtitle')}
			</EuiConfirmModal>
		);
	},
);
