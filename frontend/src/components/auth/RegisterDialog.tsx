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
	useGeneratedHtmlId,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IUserObject } from '../../dto/users/IUserObject';
import { RegisterDialogStore } from '../../stores/auth/RegisterDialogStore';

interface RegisterDialogProps {
	onClose: () => void;
	onSuccess: (user: IUserObject) => void;
}

const RegisterDialog = observer(
	({ onClose, onSuccess }: RegisterDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(() => new RegisterDialogStore());

		const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

		return (
			<EuiModal onClose={onClose} initialFocus="[name=email]">
				<EuiModalHeader>
					<EuiModalHeaderTitle>
						<h1>{t('auth.register')}</h1>
					</EuiModalHeaderTitle>
				</EuiModalHeader>

				<EuiModalBody>
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
						{t('auth.register')}
					</EuiButton>
				</EuiModalFooter>
			</EuiModal>
		);
	},
);

export default RegisterDialog;
