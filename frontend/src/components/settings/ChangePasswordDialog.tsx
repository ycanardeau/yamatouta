import {
	EuiButton,
	EuiButtonEmpty,
	EuiFieldPassword,
	EuiForm,
	EuiFormRow,
	EuiModal,
	EuiModalBody,
	EuiModalFooter,
	EuiModalHeader,
	EuiModalHeaderTitle,
	EuiSpacer,
	useGeneratedHtmlId,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IAuthenticatedUserObject } from '../../dto/IAuthenticatedUserObject';
import { ChangePasswordDialogStore } from '../../stores/settings/ChangePasswordDialogStore';

interface ChangePasswordDialogProps {
	onClose: () => void;
	onSuccess: (user: IAuthenticatedUserObject) => void;
}

export const ChangePasswordDialog = observer(
	({ onClose, onSuccess }: ChangePasswordDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(() => new ChangePasswordDialogStore());

		const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

		return (
			<EuiModal onClose={onClose} initialFocus="[name=email]">
				<EuiModalHeader>
					<EuiModalHeaderTitle>
						<h1>{t('settings.changePasswordDialogTitle')}</h1>
					</EuiModalHeaderTitle>
				</EuiModalHeader>

				<EuiModalBody>
					{t('settings.changePasswordDialogSubtitle')}
					<EuiSpacer />

					<EuiForm
						id={modalFormId}
						component="form"
						onSubmit={async (e): Promise<void> => {
							e.preventDefault();

							const translation = await store.submit();

							onClose();
							onSuccess(translation);
						}}
					>
						<EuiFormRow label={t('settings.currentPassword')}>
							<EuiFieldPassword
								compressed
								name="password"
								type="dual"
								value={store.currentPassword}
								onChange={(e): void =>
									store.setCurrentPassword(e.target.value)
								}
							/>
						</EuiFormRow>

						<EuiFormRow label={t('settings.newPassword')}>
							<EuiFieldPassword
								compressed
								name="newPassword"
								type="dual"
								value={store.newPassword}
								onChange={(e): void =>
									store.setNewPassword(e.target.value)
								}
							/>
						</EuiFormRow>

						<EuiFormRow label={t('settings.confirmNewPassword')}>
							<EuiFieldPassword
								compressed
								name="confirmNewPassword"
								type="dual"
								value={store.confirmNewPassword}
								onChange={(e): void =>
									store.setConfirmNewPassword(e.target.value)
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
						{t('shared.done')}
					</EuiButton>
				</EuiModalFooter>
			</EuiModal>
		);
	},
);
