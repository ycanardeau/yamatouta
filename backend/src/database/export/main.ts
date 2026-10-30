import { exportJson } from '@/database/export/exportJson';
import options from '@/mikro-orm.config';
import { MikroORM } from '@mikro-orm/core';
import { resolve } from 'path';

// Usage: npm run export:json [-- <outDir>]
const main = async (): Promise<void> => {
	const outDir = resolve(
		process.argv[2] ??
			resolve(__dirname, '../../../../frontend/src/database'),
	);

	const orm = await MikroORM.init({ ...options, debug: false });

	try {
		await exportJson(orm.em.fork(), outDir);
	} finally {
		await orm.close();
	}
};

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
