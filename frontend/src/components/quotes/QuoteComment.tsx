import {
	EuiButtonIcon,
	EuiComment,
	EuiContextMenuItem,
	EuiContextMenuPanel,
	EuiIcon,
	EuiPopover,
} from '@elastic/eui';
import {
	DeleteRegular,
	EditRegular,
	HistoryRegular,
	InfoRegular,
	MoreHorizontalRegular,
} from '@fluentui/react-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IQuoteObject } from '../../dto/IQuoteObject';
import { Permission } from '../../models/Permission';
import { QuoteSearchStore } from '../../stores/quotes/QuoteSearchStore';
import { Avatar } from '../Avatar';
import { Link } from '../Link';
import { useAuth } from '../useAuth';
import { useDialog } from '../useDialog';
import { QuoteDeleteDialog } from './QuoteDeleteDialog';

interface QuotePopoverProps {
	store?: QuoteSearchStore;
	quote: IQuoteObject;
}

const QuotePopover = ({
	store,
	quote,
}: QuotePopoverProps): React.ReactElement => {
	const { t } = useTranslation();

	const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
	const togglePopover = (): void => setIsPopoverOpen(!isPopoverOpen);
	const closePopover = (): void => setIsPopoverOpen(false);

	const navigate = useNavigate();

	const quoteDeleteDialog = useDialog();

	const auth = useAuth();

	return (
		<>
			<EuiPopover
				button={
					<EuiButtonIcon
						iconType={MoreHorizontalRegular}
						size="xs"
						color="text"
						onClick={togglePopover}
						aria-label={t(`shared.actions`)}
					/>
				}
				isOpen={isPopoverOpen}
				closePopover={closePopover}
				panelPaddingSize="none"
				anchorPosition="leftCenter"
			>
				<EuiContextMenuPanel>
					<EuiContextMenuItem
						icon={<EuiIcon type={InfoRegular} />}
						href={`/quotes/${quote.id}`}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(`/quotes/${quote.id}`);
						}}
					>
						{t('shared.viewBasicInfo')}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type={EditRegular} />}
						href={`/quotes/${quote.id}/edit`}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(`/quotes/${quote.id}/edit`);
						}}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.Quote_Update,
							)
						}
					>
						{t('shared.doEdit')}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type={HistoryRegular} />}
						href={`/quotes/${quote.id}/revisions`}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(`/quotes/${quote.id}/revisions`);
						}}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.Revision_View,
							)
						}
					>
						{t('shared.viewHistory')}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type={DeleteRegular} color="danger" />}
						onClick={(): void => {
							closePopover();
							quoteDeleteDialog.show();
						}}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.Quote_Delete,
							)
						}
					>
						{t('shared.delete')}
					</EuiContextMenuItem>
				</EuiContextMenuPanel>
			</EuiPopover>

			{quoteDeleteDialog.visible && (
				<QuoteDeleteDialog
					quote={quote}
					onClose={quoteDeleteDialog.close}
					onSuccess={async (): Promise<void> => {
						await store?.updateResults(true);
					}}
				/>
			)}
		</>
	);
};

interface QuoteCommentProps {
	store?: QuoteSearchStore;
	quote: IQuoteObject;
}

export const QuoteComment = ({
	store,
	quote,
}: QuoteCommentProps): React.ReactElement => {
	return (
		<EuiComment
			username={
				<Link
					color="text"
					style={{ fontSize: 'inherit', fontWeight: 'inherit' }}
					to={`/artists/${quote.artist.id}`}
				>
					{quote.artist.name}
				</Link>
			}
			timelineIcon={<Avatar size="l" name={quote.artist.name} />}
			actions={<QuotePopover store={store} quote={quote} />}
		>
			{quote.text.replaceAll('\n', '')}
		</EuiComment>
	);
};
