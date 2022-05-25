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

import WebLinkListEdit from '../../components/WebLinkListEdit';
import { ITranslationObject } from '../../dto/ITranslationObject';
import { WordCategory } from '../../models/translations/WordCategory';
import { TranslationEditStore } from '../../stores/translations/TranslationEditStore';

interface TranslationEditFormProps {
	translation?: ITranslationObject;
}

const TranslationEditForm = observer(
	({ translation }: TranslationEditFormProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(
			() => new TranslationEditStore(translation),
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

						navigate(`/translations/${translation.id}`);
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

					<EuiFormRow label={t('shared.externalLinks')} fullWidth>
						<WebLinkListEdit store={store.webLinks} />
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
						href={
							translation
								? `/translations/${translation.id}`
								: '/translations'
						}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(
								translation
									? `/translations/${translation.id}`
									: '/translations',
							);
						}}
					>
						{t('shared.cancel')}
					</EuiButtonEmpty>
				</div>
			</>
		);
	},
);

export default TranslationEditForm;
