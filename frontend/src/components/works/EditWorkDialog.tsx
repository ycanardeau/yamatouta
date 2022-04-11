import {
	EuiButton,
	EuiButtonEmpty,
	EuiFieldText,
	EuiForm,
	EuiFormRow,
	EuiModal,
	EuiModalBody,
	EuiModalFooter,
	EuiModalHeader,
	EuiModalHeaderTitle,
	EuiSelect,
	useGeneratedHtmlId,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IWorkObject } from '../../dto/works/IWorkObject';
import { WorkType } from '../../models/WorkType';
import { EditWorkDialogStore } from '../../stores/works/EditWorkDialogStore';

interface EditWorkDialogProps {
	work?: IWorkObject;
	onClose: () => void;
	onSuccess: (work: IWorkObject) => void;
}

const EditWorkDialog = observer(
	({ work, onClose, onSuccess }: EditWorkDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(
			() => new EditWorkDialogStore({ work: work }),
		);

		const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

		return (
			<EuiModal onClose={onClose} initialFocus="[name=name]">
				<EuiModalHeader>
					<EuiModalHeaderTitle>
						<h1>
							{work ? t('works.editWork') : t('works.addWork')}
						</h1>
					</EuiModalHeaderTitle>
				</EuiModalHeader>

				<EuiModalBody>
					<EuiForm
						id={modalFormId}
						component="form"
						onSubmit={async (e): Promise<void> => {
							e.preventDefault();

							const work = await store.submit();

							onClose();
							onSuccess(work);
						}}
					>
						<EuiFormRow label={t('works.name')}>
							<EuiFieldText
								compressed
								name="name"
								value={store.name}
								onChange={(e): void =>
									store.setName(e.target.value)
								}
							/>
						</EuiFormRow>

						<EuiFormRow label={t('works.workType')}>
							<EuiSelect
								compressed
								name="workType"
								options={Object.values(WorkType).map(
									(value) => ({
										value: value,
										text: t(`workTypeNames.${value}`),
									}),
								)}
								value={store.workType ?? ''}
								onChange={(e): void =>
									store.setWorkType(
										e.target.value as WorkType,
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
						{work ? t('works.editWork') : t('works.addWork')}
					</EuiButton>
				</EuiModalFooter>
			</EuiModal>
		);
	},
);

export default EditWorkDialog;
