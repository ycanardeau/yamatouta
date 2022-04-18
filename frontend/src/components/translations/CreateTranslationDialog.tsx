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

import { ITranslationObject } from '../../dto/translations/ITranslationObject';
import { WordCategory } from '../../models/WordCategory';
import { TranslationEditStore } from '../../stores/translations/TranslationEditStore';

interface CreateTranslationDialogProps {
	translation?: ITranslationObject;
	onClose: () => void;
	onSuccess: (translation: ITranslationObject) => void;
}

const CreateTranslationDialog = observer(
	({
		translation,
		onClose,
		onSuccess,
	}: CreateTranslationDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(
			() => new TranslationEditStore(translation),
		);

		const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

		return (
			<EuiModal onClose={onClose} initialFocus="[name=headword]">
				<EuiModalHeader>
					<EuiModalHeaderTitle>
						<h1>
							{translation
								? t('translations.editWord')
								: t('translations.addWord')}
						</h1>
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
						<EuiFormRow label={t('translations.headword')}>
							<EuiFieldText
								compressed
								name="headword"
								value={store.headword}
								onChange={(e): void =>
									store.setHeadword(e.target.value)
								}
							/>
						</EuiFormRow>

						<EuiFormRow label={t('translations.reading')}>
							<EuiFieldText
								compressed
								name="reading"
								value={store.reading}
								onChange={(e): void =>
									store.setReading(e.target.value)
								}
							/>
						</EuiFormRow>

						<EuiFormRow label={t('translations.yamatokotoba')}>
							<EuiFieldText
								compressed
								name="yamatokotoba"
								value={store.yamatokotoba}
								onChange={(e): void =>
									store.setYamatokotoba(e.target.value)
								}
							/>
						</EuiFormRow>

						<EuiFormRow label={t('translations.category')}>
							<EuiSelect
								compressed
								name="category"
								options={Object.values(WordCategory).map(
									(value) => ({
										value: value,
										text: t(`wordCategoryNames.${value}`),
									}),
								)}
								value={store.category ?? ''}
								onChange={(e): void =>
									store.setCategory(
										e.target.value as WordCategory,
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
						{translation
							? t('translations.editWord')
							: t('translations.addWord')}
					</EuiButton>
				</EuiModalFooter>
			</EuiModal>
		);
	},
);

export default CreateTranslationDialog;
