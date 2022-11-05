import { PaginationStore } from '@/stores/PaginationStore';
import {
	EuiButtonEmpty,
	EuiContextMenuItem,
	EuiContextMenuPanel,
	EuiFlexGroup,
	EuiFlexItem,
	EuiPagination,
	EuiPopover,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';

interface PaginationProps {
	store: PaginationStore;
}

export const Pagination = observer(({ store }: PaginationProps) => {
	const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

	const onButtonClick = (): void =>
		setIsPopoverOpen((isPopoverOpen) => !isPopoverOpen);
	const closePopover = (): void => setIsPopoverOpen(false);

	const getIconType = (size: number): 'check' | 'empty' => {
		return size === store.pageSize ? 'check' : 'empty';
	};

	const button = (
		<EuiButtonEmpty
			size="xs"
			color="text"
			iconType="arrowDown"
			iconSide="right"
			onClick={onButtonClick}
		>
			Rows per page: {store.pageSize}
		</EuiButtonEmpty>
	);

	const items = [10, 20, 50, 100].map((i) => (
		<EuiContextMenuItem
			icon={getIconType(i)}
			onClick={(): void => {
				closePopover();
				store.setPageSize(i);
			}}
			key={i}
		>
			{i} items
		</EuiContextMenuItem>
	));

	return (
		<EuiFlexGroup
			justifyContent="spaceBetween"
			alignItems="center"
			responsive={false}
			wrap
		>
			<EuiFlexItem grow={false}>
				<EuiPopover
					button={button}
					isOpen={isPopoverOpen}
					closePopover={closePopover}
					panelPaddingSize="none"
				>
					<EuiContextMenuPanel items={items} />
				</EuiPopover>
			</EuiFlexItem>

			<EuiFlexItem grow={false}>
				<EuiPagination
					pageCount={
						store.totalPages === 0 ? undefined : store.totalPages
					}
					activePage={store.page - 1}
					onPageClick={(pageIndex): void =>
						store.setPage(pageIndex + 1)
					}
				/>
			</EuiFlexItem>
		</EuiFlexGroup>
	);
});
