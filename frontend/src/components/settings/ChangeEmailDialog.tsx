import { IAuthenticatedUserDto } from '@/dto/IAuthenticatedUserDto';
import { ChangeEmailDialogStore } from '@/stores/settings/ChangeEmailDialogStore';
import {
	EuiButton,
	EuiButtonEmpty,
	EuiFieldPassword,
	EuiFieldText,
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

interface ChangeEmailDialogProps {
	onClose: () => void;
	onSuccess: (user: IAuthenticatedUserDto) => void;
}

export const ChangeEmailDialog = observer(
	({ onClose, onSuccess }: ChangeEmailDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(() => new ChangeEmailDialogStore());

		const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

		return (
			<EuiModal onClose={onClose} initialFocus="[name=email]">
				<EuiModalHeader>
					<EuiModalHeaderTitle>
						<h1>{t('settings.changeEmailDialogTitle')}</h1>
					</EuiModalHeaderTitle>
				</EuiModalHeader>

				<EuiModalBody>
					{t('settings.changeEmailDialogSubtitle')}
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
						<EuiFormRow label={t('auth.email')}>
							<EuiFieldText
								compressed
								name="email"
								icon="email"
								value={store.email}
								onChange={(e): void =>
									store.setEmail(e.target.value)
								}
							/>
						</EuiFormRow>

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
