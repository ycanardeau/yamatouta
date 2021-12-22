import { Migration } from '@mikro-orm/migrations';

export class Migration20211220083903 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table `sessions` (`sid` varchar(255) not null, `sess` json not null, `expired` datetime not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `sessions` add primary key `sessions_pkey`(`sid`);',
		);
	}
}
