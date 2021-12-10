import { Migration } from '@mikro-orm/migrations';

export class Migration20211210030330 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table "audit_log_entries" ("id" serial primary key, "created_at" timestamptz(0) not null, "action" text check ("action" in (\'user.create\', \'user.failed_login\', \'user.login\')) not null, "actor_id" int4 not null, "actor_name" varchar(64) not null, "actor_ip" varchar(255) not null, "user_id" int4 null, "user_name" varchar(64) null);',
		);

		this.addSql(
			'alter table "audit_log_entries" add constraint "audit_log_entries_actor_id_foreign" foreign key ("actor_id") references "users" ("id") on update cascade;',
		);
		this.addSql(
			'alter table "audit_log_entries" add constraint "audit_log_entries_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;',
		);
	}
}
