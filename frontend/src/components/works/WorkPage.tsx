import { IWorkDto } from '@/dto/IWorkDto';
import { EntryUrlMapper } from '@/models/EntryUrlMapper';
import {
	EuiBreadcrumb,
	EuiPageHeaderProps,
	EuiPageTemplate,
} from '@elastic/eui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface WorkPageProps {
	work?: IWorkDto;
	pageHeaderProps?: EuiPageHeaderProps;
	children?: React.ReactNode;
}

export const WorkPage = ({
	work,
	pageHeaderProps,
	children,
}: WorkPageProps): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	return (
		<>
			<EuiPageTemplate.Header
				{...pageHeaderProps}
				restrictWidth
				breadcrumbs={([] as EuiBreadcrumb[])
					.concat({
						text: t('shared.works'),
						href: '/works',
						onClick: (e): void => {
							e.preventDefault();
							navigate('/works');
						},
					})
					.concat(
						work
							? {
									text: work.name,
									href: EntryUrlMapper.details(work),
									onClick: (e): void => {
										e.preventDefault();
										navigate(EntryUrlMapper.details(work));
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
