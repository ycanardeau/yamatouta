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
