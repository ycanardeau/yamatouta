import {
	EuiButtonIcon,
	EuiComment,
	EuiContextMenuItem,
	EuiContextMenuPanel,
	EuiIcon,
	EuiLink,
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

import { IQuoteObject } from '../../dto/quotes/IQuoteObject';
import { Permission } from '../../models/Permission';
import Avatar from '../Avatar';
import { useAuth } from '../useAuth';
import { useDialog } from '../useDialog';

interface QuotePopoverProps {
	quote: IQuoteObject;
}

const QuotePopover = ({ quote }: QuotePopoverProps): React.ReactElement => {
	const { t } = useTranslation();

	const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
	const togglePopover = (): void => setIsPopoverOpen(!isPopoverOpen);
	const closePopover = (): void => setIsPopoverOpen(false);

	const navigate = useNavigate();

	const editQuoteDialog = useDialog();
	const deleteQuoteDialog = useDialog();

	const auth = useAuth();

	return (
		<EuiPopover
			button={
				<EuiButtonIcon
					iconType={MoreHorizontalRegular}
					size="xs"
					color="text"
					onClick={togglePopover}
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
					icon={<EuiIcon type={HistoryRegular} />}
					href={`/quotes/${quote.id}/revisions`}
					onClick={(e): void => {
						e.preventDefault();
						closePopover();
						navigate(`/quotes/${quote.id}/revisions`);
					}}
					disabled={
						!auth.permissionContext.hasPermission(
							Permission.ViewEditHistory,
						)
					}
				>
					{t('shared.viewHistory')}
				</EuiContextMenuItem>
				<EuiContextMenuItem
					icon={<EuiIcon type={EditRegular} />}
					onClick={(): void => {
						closePopover();
						editQuoteDialog.show();
					}}
					disabled={
						!auth.permissionContext.hasPermission(
							Permission.EditQuotes,
						)
					}
				>
					{t('shared.edit')}
				</EuiContextMenuItem>
				<EuiContextMenuItem
					icon={<EuiIcon type={DeleteRegular} color="danger" />}
					onClick={(): void => {
						closePopover();
						deleteQuoteDialog.show();
					}}
					disabled={
						!auth.permissionContext.hasPermission(
							Permission.DeleteQuotes,
						)
					}
				>
					{t('shared.delete')}
				</EuiContextMenuItem>
			</EuiContextMenuPanel>
		</EuiPopover>
	);
};

interface QuoteCommentProps {
	quote: IQuoteObject;
}

const QuoteComment = ({ quote }: QuoteCommentProps): React.ReactElement => {
	const quoteText = quote.phrases.join('');

	const navigate = useNavigate();

	return (
		<EuiComment
			username={
				<EuiLink
					color="text"
					href={`/artists/${quote.artist.id}`}
					onClick={(e: React.MouseEvent<HTMLAnchorElement>): void => {
						e.preventDefault();
						navigate(`/artists/${quote.artist.id}`);
					}}
					style={{ fontSize: 'inherit', fontWeight: 'inherit' }}
				>
					{quote.artist.name}
				</EuiLink>
			}
			timelineIcon={<Avatar size="l" name={quote.artist.name} />}
			actions={<QuotePopover quote={quote} />}
		>
			{quoteText}
		</EuiComment>
	);
};

export default QuoteComment;
