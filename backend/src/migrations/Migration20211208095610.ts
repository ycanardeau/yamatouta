import { Migration } from '@mikro-orm/migrations';

export class Migration20211208095610 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table "users" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted" bool not null, "hidden" bool not null, "name" varchar(255) not null, "email" varchar(255) not null, "normalized_email" varchar(255) not null, "email_confirmed" bool not null, "password_hash_algorithm" varchar(255) not null, "salt" varchar(255) not null, "password_hash" varchar(255) not null, "security_stamp" varchar(255) null, "concurrency_stamp" varchar(255) null, "phone_number" varchar(255) null, "phone_number_confirmed" bool not null, "two_factor_enabled" bool not null, "lockout_end" timestamptz(0) null, "lockout_enabled" bool not null, "access_failed_count" int4 not null);',
		);
	}
}
