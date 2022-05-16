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
import { LoginDialogStore } from '../../stores/auth/LoginDialogStore';

interface LoginDialogProps {
	onClose: () => void;
	onSuccess: (user: IAuthenticatedUserObject) => void;
}

const LoginDialog = observer(
	({ onClose, onSuccess }: LoginDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(() => new LoginDialogStore());

		const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

		return (
			<EuiModal onClose={onClose} initialFocus="[name=email]">
				<EuiModalHeader>
					<EuiModalHeaderTitle>
						<h1>{t('auth.loginDialogTitle')}</h1>
					</EuiModalHeaderTitle>
				</EuiModalHeader>

				<EuiModalBody>
					{t('auth.loginDialogSubtitle')}
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

						<EuiFormRow label={t('auth.password')}>
							<EuiFieldPassword
								compressed
								name="password"
								type="dual"
								value={store.password}
								onChange={(e): void =>
									store.setPassword(e.target.value)
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
						{t('auth.logIn')}
					</EuiButton>
				</EuiModalFooter>
			</EuiModal>
		);
	},
);

export default LoginDialog;
