import {
	EuiBreadcrumb,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiPageHeaderProps,
} from '@elastic/eui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ITranslationObject } from '../../dto/ITranslationObject';
import { EntryUrlMapper } from '../../models/EntryUrlMapper';

interface TranslationPageProps {
	translation?: ITranslationObject;
	pageHeaderProps?: EuiPageHeaderProps;
	children?: React.ReactNode;
}

export const TranslationPage = ({
	translation,
	pageHeaderProps,
	children,
}: TranslationPageProps): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	return (
		<>
			<EuiPageHeader
				{...pageHeaderProps}
				breadcrumbs={([] as EuiBreadcrumb[])
					.concat({
						text: t('shared.words'),
						href: '/translations',
						onClick: (e): void => {
							e.preventDefault();
							navigate('/translations');
						},
					})
					.concat(
						translation
							? {
									text: `${translation.headword} ↔ ${translation.yamatokotoba}`,
									href: EntryUrlMapper.details(translation),
									onClick: (e): void => {
										e.preventDefault();
										navigate(
											EntryUrlMapper.details(translation),
										);
									},
							  }
							: [],
					)}
			/>

			<EuiPageContent
				hasBorder={false}
				hasShadow={false}
				paddingSize="none"
				color="transparent"
				borderRadius="none"
			>
				<EuiPageContentBody>{children}</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
};
