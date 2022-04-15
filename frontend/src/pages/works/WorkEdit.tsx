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

import { WorkType } from '../../models/WorkType';
import { EditWorkDialogStore } from '../../stores/works/EditWorkDialogStore';
import { WorkDetailsStore } from '../../stores/works/WorkDetailsStore';

interface WorkEditProps {
	workDetailsStore: WorkDetailsStore;
}

const WorkEdit = observer(
	({ workDetailsStore }: WorkEditProps): React.ReactElement => {
		const { t } = useTranslation();

		const work = workDetailsStore.work;

		const [store] = React.useState(() => new EditWorkDialogStore(work));

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

						workDetailsStore.setWork(work);
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
						href={`/works/${work.id}`}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/works/${work.id}`);
						}}
					>
						{t('shared.cancel')}
					</EuiButtonEmpty>
				</div>
			</>
		);
	},
);

export default WorkEdit;
