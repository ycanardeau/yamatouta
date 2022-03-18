export interface IEntryWithDeleted {
	deleted: boolean;
}

export interface IEntryWithHidden {
	hidden: boolean;
}

export interface IEntryWithDeletedAndHidden
	extends IEntryWithDeleted,
		IEntryWithHidden {}
