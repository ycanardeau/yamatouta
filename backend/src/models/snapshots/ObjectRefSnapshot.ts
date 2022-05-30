export class ObjectRefSnapshot<TEntry extends { id: number }> {
	private constructor(readonly id: number) {}

	static create<TEntry extends { id: number }>(
		entry: TEntry,
	): ObjectRefSnapshot<TEntry> {
		return new ObjectRefSnapshot<TEntry>(entry.id);
	}
}
