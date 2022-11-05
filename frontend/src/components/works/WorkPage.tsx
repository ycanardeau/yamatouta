import { IWorkObject } from '@/dto/IWorkObject';
import { EntryUrlMapper } from '@/models/EntryUrlMapper';
import {
	EuiBreadcrumb,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiPageHeaderProps,
} from '@elastic/eui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface WorkPageProps {
	work?: IWorkObject;
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
			<EuiPageHeader
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

			<EuiPageContent
				hasBorder={false}
				hasShadow={false}
				paddingSize="none"
				color="transparent"
				borderRadius="none"
			>
				<EuiPageContentBody restrictWidth>
					{children}
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
};
