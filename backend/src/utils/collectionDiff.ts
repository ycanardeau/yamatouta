// Code from: https://github.com/VocaDB/vocadb/blob/9038efc6d021ee7acf43a40e1eb4d342a38c942a/VocaDbModel/Helpers/CollectionHelper.cs.
import _ from 'lodash';

/**
 * Difference between two collections.
 * @author https://github.com/riipah
 */
export class CollectionDiff<TOld, TNew> {
	/** Entries that didn't exist in the old set but do exist in the new one. */
	readonly addedItems: TNew[];
	/** Entries that existed in the old set but not in the new. */
	readonly removedItems: TOld[];
	/**
	 * Entries that existed in both old and new sets.
	 * Note: the contents of those entries might still be changed, depending on equality.
	 * */
	readonly unchangedItems: TOld[];

	constructor(
		addedItems: TNew[],
		removedItems: TOld[],
		unchangedItems: TOld[],
	) {
		this.addedItems = addedItems;
		this.removedItems = removedItems;
		this.unchangedItems = unchangedItems;
	}

	/** Whether the contents of the sets were changed. */
	get changed(): boolean {
		return this.addedItems.length !== 0 || this.removedItems.length !== 0;
	}
}

/**
 * Calculates a diff between two collections, including new, unchanged and deleted items.
 * @param oldItems Original (current) collection.
 * @param newItems New collection.
 * @param equalityFunc Equality test.
 * @returns Diff for the two collections.
 * @author https://github.com/riipah
 */
export const collectionDiff = <TOld, TNew>(
	oldItems: TOld[],
	newItems: TNew[],
	equalityFunc: (oldItem: TOld, newItem: TNew) => boolean,
): CollectionDiff<TOld, TNew> => {
	const removedItems = oldItems.filter(
		(oldItem) =>
			!newItems.some((newItem) => equalityFunc(oldItem, newItem)),
	);
	const addedItems = newItems.filter(
		(newItem) =>
			!oldItems.some((oldItem) => equalityFunc(oldItem, newItem)),
	);
	const unchangedItems = _.differenceWith(
		oldItems,
		removedItems,
		(oldItem, removedItem) => oldItem == removedItem,
	);

	return new CollectionDiff(addedItems, removedItems, unchangedItems);
};

/**
 * Syncs items in one collection with a new set (create and delete, CD).
 * Removes missing items from the old collection and adds missing new items.
 *
 * This method only supports immutable items: items will never be updated.
 * For a version that supports mutable items with updates, use {@link collectionSyncWithContent}.
 * @param oldItems Original (current) collection.
 * @param newItems New collection.
 * @param equalityFunc Equality test.
 * @param createFunc Factory method for the new item.
 * @param removeFunc Callback for removing an old item if that didn't exist in the new list.
 * The old list is already updated by the algorithm. This is mostly used for cleanup of link objects.
 * @returns Diff for the two collections.
 * @author https://github.com/riipah
 */
export const collectionSync = async <TOld, TNew>(
	oldItems: TOld[],
	newItems: TNew[],
	equalityFunc: (oldItem: TOld, newItem: TNew) => boolean,
	createFunc: (newItem: TNew) => Promise<TOld | undefined>,
	removeFunc?: (oldItem: TOld) => Promise<void>,
): Promise<CollectionDiff<TOld, TOld>> => {
	const diff = collectionDiff(oldItems, newItems, equalityFunc);
	const createdItems: TOld[] = [];

	for (const removedItem of diff.removedItems) {
		await removeFunc?.(removedItem);

		_.pull(oldItems, removedItem);
	}

	for (const addedItem of diff.addedItems) {
		const createdItem = await createFunc(addedItem);

		if (createdItem !== undefined) createdItems.push(createdItem);
	}

	return new CollectionDiff(
		createdItems,
		diff.removedItems,
		diff.unchangedItems,
	);
};

/**
 * Difference between two collections, including value.
 * @author https://github.com/riipah
 */
export class CollectionDiffWithValue<TOld, TNew> extends CollectionDiff<
	TOld,
	TNew
> {
	/** Entries that existed in both old and new sets AND whose contents were changed. */
	readonly editedItems: TOld[];

	constructor(
		addedItems: TNew[],
		removedItems: TOld[],
		unchangedItems: TOld[],
		editedItems: TOld[],
	) {
		super(addedItems, removedItems, unchangedItems);

		this.editedItems = editedItems;
	}

	get changed(): boolean {
		return super.changed || this.editedItems.length !== 0;
	}
}

/**
 * Syncs items in one collection with a new set, comparing both identity and value (create, update, delete, CUD).
 * Removes missing items from the old collection and adds missing new items.
 * Existing items that have been changed will be updated.
 * @param oldItems Original (current) collection.
 * @param newItems New collection.
 * @param equalityFunc Identity equality test.
 *
 * This should only test the identity, and will be used to determine whether the item is
 * completely new, possibly updated or removed.
 * Use {@link updateFunc} to determine whether the item state has changed, assuming and existing item
 * with matching identity is found.
 * @param createFunc Factory method for creating a new item.
 *
 * Normally the factory method should return the created item,
 * but if the return value is null, no item is added to collection.
 * @param updateFunc Method for updating an existing item.
 * First parameter is the old item to be updated and second parameter is the new state.
 * Returns true if the old item was updated, or false if the items had equal content already.
 * @param removeFunc Callback for removing an old item if that didn't exist in the new list.
 * The old list is already updated by the algorithm. This is mostly used for cleanup of link objects.
 * @returns Diff for the two collections.
 * @author https://github.com/riipah
 */
export const collectionSyncWithContent = async <TOld, TNew>(
	oldItems: TOld[],
	newItems: TNew[],
	equalityFunc: (oldItem: TOld, newItem: TNew) => boolean,
	createFunc: (newItem: TNew) => Promise<TOld>,
	updateFunc: (oldItem: TOld, newItem: TNew) => Promise<boolean>,
	removeFunc?: (oldItem: TOld) => Promise<void>,
): Promise<CollectionDiffWithValue<TOld, TOld>> => {
	const diff = await collectionSync(
		oldItems,
		newItems,
		equalityFunc,
		createFunc,
		removeFunc,
	);
	const editedItems: TOld[] = [];

	for (const oldItem of diff.unchangedItems) {
		const newItem = newItems.filter((newItem) =>
			equalityFunc(oldItem, newItem),
		)[0];

		const updated = await updateFunc(oldItem, newItem);

		if (updated) editedItems.push(oldItem);
	}

	return new CollectionDiffWithValue(
		diff.addedItems,
		diff.removedItems,
		diff.unchangedItems,
		editedItems,
	);
};
