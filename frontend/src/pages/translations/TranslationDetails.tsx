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

import { TranslationPage } from '../../components/translations/TranslationPage';
import { useTranslationDetails } from '../../components/translations/useTranslationDetails';
import { useAuth } from '../../components/useAuth';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { ITranslationObject } from '../../dto/ITranslationObject';
import { TranslationDetailsObject } from '../../dto/TranslationDetailsObject';
import { EntryUrlMapper } from '../../models/EntryUrlMapper';
import { Permission } from '../../models/Permission';
import { TranslationDetailsStore } from '../../stores/translations/TranslationDetailsStore';
import TranslationBasicInfo from './TranslationBasicInfo';

interface LayoutProps {
	store: TranslationDetailsStore;
}

const Layout = observer(({ store }: LayoutProps): React.ReactElement => {
	const { t, ready } = useTranslation();

	const translation = store.translation;

	// TODO: const auth = useAuth();

	// TODO: const translationEditDialog = useDialog();

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const tab = pathname.split('/')[3];

	const auth = useAuth();

	const translationText = `${translation.headword} ↔ ${translation.yamatokotoba}`;

	const title = `${t('shared.word')} "${translationText}"`;

	useYamatoutaTitle(title, ready);

	return (
		<TranslationPage
			translation={translation}
			pageHeaderProps={{
				pageTitle: translationText,
				rightSideItems: [
					<EuiButton
						size="s"
						href={EntryUrlMapper.edit(translation)}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(EntryUrlMapper.edit(translation));
						}}
						iconType={EditRegular}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.UpdateTranslations,
							)
						}
					>
						{t('shared.doEdit')}
					</EuiButton>,
					<EuiButton
						size="s"
						href={EntryUrlMapper.revisions(translation)}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(EntryUrlMapper.revisions(translation));
						}}
						iconType={HistoryRegular}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.ViewRevisions,
							)
						}
					>
						{t('shared.viewHistory')}
					</EuiButton>,
				],
				tabs: [
					{
						href: EntryUrlMapper.details(translation),
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(EntryUrlMapper.details(translation));
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
