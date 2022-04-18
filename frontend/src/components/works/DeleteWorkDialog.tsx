import { EuiConfirmModal } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IWorkObject } from '../../dto/works/IWorkObject';
import { WorkDeleteStore } from '../../stores/works/WorkDeleteStore';

interface DeleteWorkDialogProps {
	work: IWorkObject;
	onClose: () => void;
	onSuccess: () => void;
}

const DeleteWorkDialog = observer(
	({
		work,
		onClose,
		onSuccess,
	}: DeleteWorkDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(
			() => new WorkDeleteStore({ work: work }),
		);

		return (
			<EuiConfirmModal
				title={t('works.deleteWork')}
				onCancel={onClose}
				onConfirm={async (): Promise<void> => {
					await store.submit();

					onClose();
					onSuccess();
				}}
				cancelButtonText={t('shared.cancel')}
				confirmButtonText={t('works.deleteWork')}
				buttonColor="danger"
				defaultFocusedButton="confirm"
				confirmButtonDisabled={!store.isValid || store.submitting}
			>
				{t('works.deleteDialogSubtitle')}
			</EuiConfirmModal>
		);
	},
);

export default DeleteWorkDialog;
