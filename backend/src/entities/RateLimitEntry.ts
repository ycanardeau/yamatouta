import { BigIntType, Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'rate_limit_entries' })
export class RateLimitEntry {
	@PrimaryKey()
	key!: string;

	@Property({ default: 0 })
	points = 0;

	@Property({ type: BigIntType })
	expire!: string;
}
