import { Migration } from '@mikro-orm/migrations';

export class Migration20220411004558 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			"create table `works` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted` tinyint(1) not null, `hidden` tinyint(1) not null, `name` varchar(255) not null, `work_type` enum('Unspecified', 'Book', 'Song', 'Other') not null, `version` int not null) default character set utf8mb4 engine = InnoDB;",
		);

		this.addSql('alter table `revisions` add `work_id` int unsigned null;');
		this.addSql(
			"alter table `revisions` modify `entry_type` enum('Translation', 'Artist', 'Quote', 'Work') not null;",
		);
		this.addSql(
			'alter table `revisions` add constraint `revisions_work_id_foreign` foreign key (`work_id`) references `works` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `revisions` add index `revisions_work_id_index`(`work_id`);',
		);
	}

	async down(): Promise<void> {
		this.addSql(
			'alter table `revisions` drop foreign key `revisions_work_id_foreign`;',
		);

		this.addSql('drop table if exists `works`;');

		this.addSql(
			"alter table `revisions` modify `entry_type` enum('Translation', 'Artist', 'Quote') not null;",
		);
		this.addSql(
			'alter table `revisions` drop index `revisions_work_id_index`;',
		);
		this.addSql('alter table `revisions` drop `work_id`;');
	}
}
