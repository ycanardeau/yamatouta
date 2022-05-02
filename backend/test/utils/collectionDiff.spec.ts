// Code from: https://github.com/VocaDB/vocadb/blob/f168271dbb243cc8e095b511658203a516375ab5/Tests/Helpers/CollectionHelperTests.cs.
import {
	CollectionDiffWithValue,
	collectionSync,
	collectionSyncWithContent,
} from '../../src/utils/collectionDiff';

describe('collectionSync', () => {
	const equalityFunc = (oldItem: string, newItem: number): boolean =>
		oldItem === newItem.toString();

	const createFunc = async (value: number): Promise<string> =>
		value.toString();

	test('added', async () => {
		const oldItems: string[] = [];
		const newItems = [39];

		const result = await collectionSync(
			oldItems,
			newItems,
			equalityFunc,
			createFunc,
		);

		expect(result).toBeDefined();
		expect(result.changed).toBe(true);
		expect(result.addedItems.length).toBe(1);
		expect(result.removedItems.length).toBe(0);
		expect(result.unchangedItems.length).toBe(0);
		expect(result.addedItems[0]).toBe('39');
	});

	test('unchanged', async () => {
		const oldItems = ['39'];
		const newItems = [39];

		const result = await collectionSync(
			oldItems,
			newItems,
			equalityFunc,
			createFunc,
		);

		expect(result).toBeDefined();
		expect(result.changed).toBe(false);
		expect(result.addedItems.length).toBe(0);
		expect(result.removedItems.length).toBe(0);
		expect(result.unchangedItems.length).toBe(1);
		expect(result.unchangedItems[0]).toBe('39');
	});

	test('replaced', async () => {
		const oldItems = ['39'];
		const newItems = [3939];

		const result = await collectionSync(
			oldItems,
			newItems,
			equalityFunc,
			createFunc,
		);

		expect(result).toBeDefined();
		expect(result.changed).toBe(true);
		expect(result.addedItems.length).toBe(1);
		expect(result.removedItems.length).toBe(1);
		expect(result.unchangedItems.length).toBe(0);
		expect(result.addedItems[0]).toBe('3939');
		expect(result.removedItems[0]).toBe('39');
	});

	test('removed', async () => {
		const oldItems = ['39'];
		const newItems: number[] = [];

		const result = await collectionSync(
			oldItems,
			newItems,
			equalityFunc,
			createFunc,
		);

		expect(result).toBeDefined();
		expect(result.changed).toBe(true);
		expect(result.addedItems.length).toBe(0);
		expect(result.removedItems.length).toBe(1);
		expect(result.unchangedItems.length).toBe(0);
		expect(result.removedItems[0]).toBe('39');
	});
});

describe('collectionSyncWithContent', () => {
	class Entity {
		id: number;
		value: string;

		constructor(id: number, value: string) {
			this.id = id;
			this.value = value;
		}
	}

	class EntityProto {
		id: number;
		value: number;

		constructor(id: number, value: number) {
			this.id = id;
			this.value = value;
		}
	}

	const equalityFunc = (oldItem: Entity, newItem: EntityProto): boolean => {
		return oldItem.id === newItem.id;
	};

	const createFunc = async (newItem: EntityProto): Promise<Entity> => {
		return new Entity(0, newItem.value.toString());
	};

	const updateFunc = async (
		oldItem: Entity,
		newItem: EntityProto,
	): Promise<boolean> => {
		if (oldItem.value === newItem.value.toString()) return false;

		oldItem.value = newItem.value.toString();
		return true;
	};

	const entityList = (...str: string[]): Entity[] => {
		return str.map((s, index) => new Entity(index + 1, s));
	};

	const entityProtoList = (...str: number[]): EntityProto[] => {
		return str.map((s, index) => new EntityProto(index + 1, s));
	};

	const testCollectionSyncWithValue = async ({
		oldItems,
		newItems,
		addedCount = 0,
		removedCount = 0,
		editedCount = 0,
		unchangedCount = 0,
	}: {
		oldItems: Entity[];
		newItems: EntityProto[];
		addedCount?: number;
		removedCount?: number;
		editedCount?: number;
		unchangedCount?: number;
	}): Promise<CollectionDiffWithValue<Entity, Entity>> => {
		const result = await collectionSyncWithContent(
			oldItems,
			newItems,
			equalityFunc,
			createFunc,
			updateFunc,
		);

		expect(result).toBeDefined();
		expect(result.changed).toBe(
			addedCount > 0 || removedCount > 0 || editedCount > 0,
		);
		expect(result.addedItems.length).toBe(addedCount);
		expect(result.editedItems.length).toBe(editedCount);
		expect(result.removedItems.length).toBe(removedCount);
		expect(result.unchangedItems.length).toBe(unchangedCount);
		return result;
	};

	test('added', async () => {
		const result = await testCollectionSyncWithValue({
			oldItems: entityList(),
			newItems: entityProtoList(39),
			addedCount: 1,
		});
		expect(result.addedItems[0].value).toBe('39');
	});

	test('removed', async () => {
		const result = await testCollectionSyncWithValue({
			oldItems: entityList('39'),
			newItems: entityProtoList(),
			removedCount: 1,
		});
		expect(result.removedItems[0].value).toBe('39');
	});

	test('unchanged', async () => {
		const result = await testCollectionSyncWithValue({
			oldItems: entityList('39'),
			newItems: entityProtoList(39),
			unchangedCount: 1,
		});
		expect(result.unchangedItems[0].value).toBe('39');
	});

	test('edited', async () => {
		const result = await testCollectionSyncWithValue({
			oldItems: entityList('39'),
			newItems: entityProtoList(3939),
			editedCount: 1,
			unchangedCount: 1,
		});
		expect(result.editedItems[0].value).toBe('3939');
	});

	test('replaced', async () => {
		const oldItems = entityList('39');
		const newItems = entityProtoList(3939);
		newItems[0].id = 2;

		const result = await testCollectionSyncWithValue({
			oldItems,
			newItems,
			addedCount: 1,
			removedCount: 1,
		});
		expect(result.addedItems[0].value).toBe('3939');
		expect(result.removedItems[0].value).toBe('39');
	});
});
