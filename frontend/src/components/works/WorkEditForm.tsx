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
import { IWorkObject } from '../../dto/IWorkObject';
import { workArtistLinkTypes } from '../../models/LinkType';
import { WorkType } from '../../models/works/WorkType';
import { WorkEditStore } from '../../stores/works/WorkEditStore';
import ArtistLinkListEdit from '../ArtistLinkListEdit';

interface WorkEditFormProps {
	work?: IWorkObject;
}

const WorkEditForm = observer(
	({ work }: WorkEditFormProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(() => new WorkEditStore(work));

		const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

		const navigate = useNavigate();

		return (
			<>
				<EuiForm
					id={modalFormId}
					component="form"
					onSubmit={async (e): Promise<void> => {
						e.preventDefault();

						const work = await store.submit();

						navigate(`/works/${work.id}`);
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
							options={Object.values(WorkType).map((value) => ({
								value: value,
								text: t(`workTypeNames.${value}`),
							}))}
							value={store.workType ?? ''}
							onChange={(e): void =>
								store.setWorkType(e.target.value as WorkType)
							}
						/>
					</EuiFormRow>

					<EuiFormRow label={t('shared.externalLinks')} fullWidth>
						<WebLinkListEdit store={store.webLinks} />
					</EuiFormRow>

					<EuiFormRow label={t('shared.artistLinks')} fullWidth>
						<ArtistLinkListEdit
							store={store.artistLinks}
							allowedLinkTypes={workArtistLinkTypes}
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
						{work ? t('works.editWork') : t('works.addWork')}
					</EuiButton>
					&emsp;
					<EuiButtonEmpty
						size="s"
						href={work ? `/works/${work.id}` : '/works'}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(work ? `/works/${work.id}` : '/works');
						}}
					>
						{t('shared.cancel')}
					</EuiButtonEmpty>
				</div>
			</>
		);
	},
);

export default WorkEditForm;
