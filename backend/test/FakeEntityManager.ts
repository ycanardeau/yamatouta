import { AnyEntity, Reference } from '@mikro-orm/core';

export class FakeEntityManager {
	readonly entities: (
		| AnyEntity
		| Reference<AnyEntity>
		| (AnyEntity | Reference<AnyEntity>)
	)[] = [];

	transactional<T>(cb: (em: FakeEntityManager) => Promise<T>): Promise<T> {
		return cb(this);
	}

	persist(
		entity:
			| AnyEntity
			| Reference<AnyEntity>
			| (AnyEntity | Reference<AnyEntity>)[],
	): void {
		this.entities.push(entity);
	}
}
