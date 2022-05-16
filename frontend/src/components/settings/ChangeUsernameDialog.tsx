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

import { IAuthenticatedUserObject } from '../../dto/IAuthenticatedUserObject';
import { ChangeUsernameDialogStore } from '../../stores/settings/ChangeUsernameDialogStore';

interface ChangeUsernameDialogProps {
	user: IAuthenticatedUserObject;
	onClose: () => void;
	onSuccess: (user: IAuthenticatedUserObject) => void;
}

const ChangeUsernameDialog = observer(
	({
		user,
		onClose,
		onSuccess,
	}: ChangeUsernameDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(
			() => new ChangeUsernameDialogStore(user),
		);

		const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

		return (
			<EuiModal onClose={onClose} initialFocus="[name=email]">
				<EuiModalHeader>
					<EuiModalHeaderTitle>
						<h1>{t('settings.changeUsernameDialogTitle')}</h1>
					</EuiModalHeaderTitle>
				</EuiModalHeader>

				<EuiModalBody>
					{t('settings.changeUsernameDialogSubtitle')}
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
						<EuiFormRow label={t('auth.username')}>
							<EuiFieldText
								compressed
								name="username"
								icon="user"
								value={store.username}
								onChange={(e): void =>
									store.setUsername(e.target.value)
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

export default ChangeUsernameDialog;
