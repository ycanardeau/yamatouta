import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiIcon,
	EuiPageHeader,
	EuiSpacer,
	EuiTab,
	EuiTabs,
} from '@elastic/eui';
import { HistoryRegular, InfoRegular } from '@fluentui/react-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
	Route,
	Routes,
	useLocation,
	useNavigate,
	useParams,
} from 'react-router-dom';

import { getTranslation } from '../../api/TranslationApi';
import { useAuth } from '../../components/useAuth';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { ITranslationObject } from '../../dto/translations/ITranslationObject';
import { Permission } from '../../models/Permission';
import TranslationBasicInfo from './TranslationBasicInfo';
import TranslationHistory from './TranslationHistory';

interface BreadcrumbsProps {
	translation: ITranslationObject;
}

const Breadcrumbs = ({ translation }: BreadcrumbsProps): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	const breadcrumbs: EuiBreadcrumb[] = [
		{
			text: t('shared.words'),
			href: '/translations',
			onClick: (e): void => {
				e.preventDefault();
				navigate('/translations');
			},
		},
		{
			text: `${translation.headword} ↔ ${translation.yamatokotoba}`,
			href: `/translations/${translation.id}`,
			onClick: (e): void => {
				e.preventDefault();
				navigate(`/translations/${translation.id}`);
			},
		},
	];

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};

interface LayoutProps {
	translation: ITranslationObject;
}

const Layout = ({ translation }: LayoutProps): React.ReactElement => {
	const { t } = useTranslation();

	const title = `${translation.headword} ↔ ${translation.yamatokotoba}`;

	useYamatoutaTitle(title, true);

	// TODO: const auth = useAuth();

	// TODO: const editTranslationDialog = useDialog();

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const tab = pathname.split('/')[3];

	const auth = useAuth();

	return (
		<>
			<Breadcrumbs translation={translation} />
			<EuiSpacer size="xs" />
			<EuiPageHeader
				pageTitle={title}
				/* TODO: rightSideItems={[
					<EuiButton
						size="s"
						onClick={editTranslationDialog.show}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.EditTranslations,
							)
						}
						iconType={EditRegular}
					>
						{t('translations.editWord')}
					</EuiButton>,
				]}*/
			/>

			<EuiTabs>
				<EuiTab
					href={`/translations/${translation.id}`}
					onClick={(e: React.MouseEvent<HTMLAnchorElement>): void => {
						e.preventDefault();
						navigate(`/translations/${translation.id}`);
					}}
					prepend={<EuiIcon type={InfoRegular} />}
					isSelected={!tab}
				>
					{t('shared.details')}
				</EuiTab>
				<EuiTab
					href={`/translations/${translation.id}/revisions`}
					onClick={(e: React.MouseEvent<HTMLAnchorElement>): void => {
						e.preventDefault();
						navigate(`/translations/${translation.id}/revisions`);
					}}
					prepend={<EuiIcon type={HistoryRegular} />}
					isSelected={tab === 'revisions'}
					disabled={
						!auth.permissionContext.hasPermission(
							Permission.ViewEditHistory,
						)
					}
				>
					{t('shared.revisions')}
				</EuiTab>
			</EuiTabs>

			<EuiSpacer />

			<Routes>
				<Route
					path=""
					element={<TranslationBasicInfo translation={translation} />}
				/>
				<Route
					path="revisions"
					element={<TranslationHistory translation={translation} />}
				/>
			</Routes>

			{/* TODO: editTranslationDialog.visible && (
				<EditTranslationDialog
					translation={translation}
					onClose={editTranslationDialog.close}
					onSuccess={(translation): void => {}}
				/>
			)*/}
		</>
	);
};

const TranslationDetails = (): React.ReactElement | null => {
	const { translationId } = useParams();

	const [model, setModel] =
		React.useState<{ translation: ITranslationObject }>();

	React.useEffect(() => {
		getTranslation({ translationId: Number(translationId) }).then(
			(translation) => setModel({ translation: translation }),
		);
	}, [translationId]);

	return model ? <Layout translation={model.translation} /> : null;
};

export default TranslationDetails;
