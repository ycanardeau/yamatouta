import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiIcon,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import {
	EditRegular,
	HistoryRegular,
	InfoRegular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
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
import { TranslationOptionalFields } from '../../models/TranslationOptionalFields';
import { TranslationDetailsStore } from '../../stores/translations/TranslationDetailsStore';
import TranslationBasicInfo from './TranslationBasicInfo';
import TranslationEdit from './TranslationEdit';
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
	store: TranslationDetailsStore;
}

const Layout = observer(({ store }: LayoutProps): React.ReactElement => {
	const { t } = useTranslation();

	const translation = store.translation;

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
				tabs={[
					{
						href: `/translations/${translation.id}`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/translations/${translation.id}`);
						},
						prepend: <EuiIcon type={InfoRegular} />,
						isSelected: !tab,
						label: t('shared.basicInfo'),
					},
					{
						href: `/translations/${translation.id}/edit`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/translations/${translation.id}/edit`);
						},
						prepend: <EuiIcon type={EditRegular} />,
						isSelected: tab === 'edit',
						disabled: !auth.permissionContext.hasPermission(
							Permission.EditTranslations,
						),
						label: t('shared.edit'),
					},
					{
						href: `/translations/${translation.id}/revisions`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(
								`/translations/${translation.id}/revisions`,
							);
						},
						prepend: <EuiIcon type={HistoryRegular} />,
						isSelected: tab === 'revisions',
						disabled: !auth.permissionContext.hasPermission(
							Permission.ViewEditHistory,
						),
						label: t('shared.revisions'),
					},
				]}
			/>

			<EuiPageContent
				hasBorder={false}
				hasShadow={false}
				paddingSize="none"
				color="transparent"
				borderRadius="none"
			>
				<EuiPageContentBody>
					<Routes>
						<Route
							path=""
							element={
								<TranslationBasicInfo
									translation={translation}
								/>
							}
						/>
						<Route
							path="revisions"
							element={
								<TranslationHistory translation={translation} />
							}
						/>
						<Route
							path="edit"
							element={
								<TranslationEdit
									translationDetailsStore={store}
								/>
							}
						/>
					</Routes>
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
});

const TranslationDetails = (): React.ReactElement | null => {
	const { translationId } = useParams();

	const [store, setStore] = React.useState<TranslationDetailsStore>();

	React.useEffect(() => {
		getTranslation({
			translationId: Number(translationId),
			fields: [TranslationOptionalFields.WebLinks],
		}).then((translation) =>
			setStore(new TranslationDetailsStore(translation)),
		);
	}, [translationId]);

	return store ? <Layout store={store} /> : null;
};

export default TranslationDetails;
