export class ObjectRefSnapshot<TEntry extends { id: number }> {
	readonly id: number;

	constructor(entry: TEntry) {
		this.id = entry.id;
	}
}
