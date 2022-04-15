import {
	EuiButton,
	EuiButtonEmpty,
	EuiFieldText,
	EuiForm,
	EuiFormRow,
	EuiSelect,
	EuiSpacer,
	useGeneratedHtmlId,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ITranslationObject } from '../../dto/translations/ITranslationObject';
import { WordCategory } from '../../models/WordCategory';
import { EditTranslationDialogStore } from '../../stores/translations/EditTranslationDialogStore';

interface TranslationEditProps {
	translation: ITranslationObject;
}

const TranslationEdit = observer(
	({ translation }: TranslationEditProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(
			() => new EditTranslationDialogStore(translation),
		);

		const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

		const navigate = useNavigate();

		return (
			<>
				<EuiForm
					id={modalFormId}
					component="form"
					onSubmit={async (e): Promise<void> => {
						e.preventDefault();

						const translation = await store.submit();

						//onClose();
						//onSuccess(translation);
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

				<EuiSpacer />

				<div>
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
					&emsp;
					<EuiButtonEmpty
						size="s"
						href={`/translations/${translation.id}`}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/translations/${translation.id}`);
						}}
					>
						{t('shared.cancel')}
					</EuiButtonEmpty>
				</div>
			</>
		);
	},
);

export default TranslationEdit;
