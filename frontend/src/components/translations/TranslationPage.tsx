import {
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiPageHeaderProps,
	EuiSpacer,
} from '@elastic/eui';

import { ITranslationObject } from '../../dto/ITranslationObject';
import { TranslationBreadcrumbs } from './TranslationBreadcrumbs';

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
	return (
		<>
			<TranslationBreadcrumbs translation={translation} />
			<EuiSpacer size="xs" />
			<EuiPageHeader {...pageHeaderProps} />

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
