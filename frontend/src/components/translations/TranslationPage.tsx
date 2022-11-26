import { ITranslationDto } from '@/dto/ITranslationDto';
import { EntryUrlMapper } from '@/models/EntryUrlMapper';
import {
	EuiBreadcrumb,
	EuiPageHeaderProps,
	EuiPageTemplate,
} from '@elastic/eui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface TranslationPageProps {
	translation?: ITranslationDto;
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
			<EuiPageTemplate.Header
				{...pageHeaderProps}
				restrictWidth
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
			<EuiPageTemplate.Section restrictWidth>
				{children}
			</EuiPageTemplate.Section>
		</>
	);
};
