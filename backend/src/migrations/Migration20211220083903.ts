import { Migration } from '@mikro-orm/migrations';

export class Migration20211220083903 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table "sessions" ("sid" varchar(255) not null, "sess" jsonb not null, "expired" timestamptz(0) not null);',
		);
		this.addSql(
			'alter table "sessions" add constraint "sessions_pkey" primary key ("sid");',
		);
	}
}
