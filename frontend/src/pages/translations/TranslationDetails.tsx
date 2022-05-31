import { EuiButton, EuiIcon } from '@elastic/eui';
import {
	EditRegular,
	HistoryRegular,
	InfoRegular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import TranslationPage from '../../components/translations/TranslationPage';
import { useTranslationDetails } from '../../components/translations/useTranslationDetails';
import { useAuth } from '../../components/useAuth';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { ITranslationObject } from '../../dto/ITranslationObject';
import { TranslationDetailsObject } from '../../dto/TranslationDetailsObject';
import { Permission } from '../../models/Permission';
import { TranslationDetailsStore } from '../../stores/translations/TranslationDetailsStore';
import TranslationBasicInfo from './TranslationBasicInfo';

interface LayoutProps {
	store: TranslationDetailsStore;
}

const Layout = observer(({ store }: LayoutProps): React.ReactElement => {
	const { t } = useTranslation();

	const translation = store.translation;

	// TODO: const auth = useAuth();

	// TODO: const translationEditDialog = useDialog();

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const tab = pathname.split('/')[3];

	const auth = useAuth();

	const title = `${translation.headword} ↔ ${translation.yamatokotoba}`;

	useYamatoutaTitle(title, true);

	return (
		<TranslationPage
			translation={translation}
			pageHeaderProps={{
				pageTitle: title,
				rightSideItems: [
					<EuiButton
						size="s"
						href={`/translations/${translation.id}/edit`}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/translations/${translation.id}/edit`);
						}}
						iconType={EditRegular}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.Translation_Update,
							)
						}
					>
						{t('shared.doEdit')}
					</EuiButton>,
					<EuiButton
						size="s"
						href={`/translations/${translation.id}/revisions`}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(
								`/translations/${translation.id}/revisions`,
							);
						}}
						iconType={HistoryRegular}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.Revision_View,
							)
						}
					>
						{t('shared.viewHistory')}
					</EuiButton>,
				],
				tabs: [
					{
						href: `/translations/${translation.id}`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/translations/${translation.id}`);
						},
						prepend: <EuiIcon type={InfoRegular} />,
						isSelected: tab === undefined,
						label: t('shared.basicInfo'),
					},
				],
			}}
		>
			<Routes>
				<Route
					path=""
					element={<TranslationBasicInfo translation={translation} />}
				/>
			</Routes>
		</TranslationPage>
	);
});

const TranslationDetails = (): React.ReactElement | null => {
	const [store] = useTranslationDetails(
		React.useCallback(
			(translation) =>
				new TranslationDetailsStore(
					TranslationDetailsObject.create(
						translation as Required<ITranslationObject>,
					),
				),
			[],
		),
	);

	return store ? <Layout store={store} /> : null;
};

export default TranslationDetails;
