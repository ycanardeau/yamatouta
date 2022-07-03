import { EuiTableBody, EuiTableRow, EuiTableRowCell } from '@elastic/eui';

interface TableEmptyBodyProps {
	colSpan?: number;
	noItemsMessage: string;
}

export const TableEmptyBody = ({
	colSpan,
	noItemsMessage,
}: TableEmptyBodyProps): React.ReactElement => {
	return (
		/* FIXME */
		/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
		/* @ts-ignore */
		<EuiTableBody>
			<EuiTableRow>
				<EuiTableRowCell
					align="center"
					colSpan={colSpan}
					mobileOptions={{ width: '100%' }}
				>
					{noItemsMessage}
				</EuiTableRowCell>
			</EuiTableRow>
		</EuiTableBody>
	);
};
