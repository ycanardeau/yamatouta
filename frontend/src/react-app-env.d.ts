/// <reference types="react-scripts" />
import { EuiTableBodyProps } from '@elastic/eui';

// Code from https://github.com/elastic/eui/pull/6022#issuecomment-1175369089, thanks @chandlerprall!
declare module '@elastic/eui' {
	export const EuiTableBody: FunctionComponent<
		EuiTableBodyProps & { children: ReactNode }
	>;
}
