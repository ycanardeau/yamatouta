import { Knex } from '@mikro-orm/mariadb';

export const orderByIds = (
	knex: Knex.QueryBuilder,
	ids: number[],
): Knex.QueryBuilder => {
	if (ids.length === 0) return knex;

	// Yields `field(id, ?, ?, ..., ?)`.
	const sql = `field(id, ${Array(ids.length).fill('?').join(', ')})`;

	return knex.orderByRaw(sql, ids);
};
