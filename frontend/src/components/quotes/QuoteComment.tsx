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
import { EntryUrlMapper } from '../../models/EntryUrlMapper';
import { Permission } from '../../models/Permission';
import { QuoteSearchStore } from '../../stores/quotes/QuoteSearchStore';
import { Avatar } from '../Avatar';
import { Link } from '../Link';
import { Markdown } from '../Markdown';
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
						href={EntryUrlMapper.details(quote)}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(EntryUrlMapper.details(quote));
						}}
					>
						{t('shared.viewBasicInfo')}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type={EditRegular} />}
						href={EntryUrlMapper.edit(quote)}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(EntryUrlMapper.edit(quote));
						}}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.UpdateQuotes,
							)
						}
					>
						{t('shared.doEdit')}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type={HistoryRegular} />}
						href={EntryUrlMapper.revisions(quote)}
						onClick={(e): void => {
							e.preventDefault();
							closePopover();
							navigate(EntryUrlMapper.revisions(quote));
						}}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.ViewRevisions,
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
								Permission.DeleteQuotes,
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
	const { t } = useTranslation();

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
			timestamp={
				<Link
					color="text"
					style={{ fontSize: 'inherit', fontWeight: 'inherit' }}
					to={EntryUrlMapper.details(quote)}
				>
					{t('shared.unknownDate')}
				</Link>
			}
			timelineIcon={<Avatar size="l" name={quote.artist.name} />}
			actions={<QuotePopover store={store} quote={quote} />}
		>
			<Markdown>{quote.text}</Markdown>
		</EuiComment>
	);
};
