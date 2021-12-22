import { Migration } from '@mikro-orm/migrations';

export class Migration20211219081459 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table `rate_limit_entries` (`key` varchar(255) not null, `points` int(11) not null default 0, `expire` bigint not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `rate_limit_entries` add primary key `rate_limit_entries_pkey`(`key`);',
		);
	}
}
