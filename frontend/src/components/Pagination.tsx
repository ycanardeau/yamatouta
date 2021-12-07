import { Grid, Pagination as MuiPagination } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { PaginationStore } from '../stores/PaginationStore';

interface IPaginationProps {
	store: PaginationStore;
}

const Pagination = observer(
	({ store }: IPaginationProps): React.ReactElement => {
		const handleChange = React.useCallback(
			(_, number) => {
				store.setPage(number);
			},
			[store],
		);

		return (
			<Grid container justifyContent="center" sx={{ py: 2 }}>
				<MuiPagination
					count={store.totalPages}
					page={store.page}
					onChange={handleChange}
					color="primary"
					siblingCount={2}
				/>
			</Grid>
		);
	},
);

export default Pagination;
