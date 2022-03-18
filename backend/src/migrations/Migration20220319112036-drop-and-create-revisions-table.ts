import { Migration } from '@mikro-orm/migrations';

export class Migration20220319112036 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'alter table `change_log_entries` drop foreign key `change_log_entries_revision_id_foreign`;',
		);

		this.addSql(
			'alter table `change_log_changes` drop foreign key `change_log_changes_change_log_entry_id_foreign`;',
		);

		this.addSql('drop table if exists `revisions`;');

		this.addSql('drop table if exists `change_log_entries`;');

		this.addSql('drop table if exists `change_log_changes`;');

		this.addSql(
			'create table `commits` (`id` int unsigned not null auto_increment primary key) default character set utf8mb4 engine = InnoDB;',
		);

		this.addSql(
			"create table `revisions` (`id` int unsigned not null auto_increment primary key, `commit_id` int unsigned not null, `actor_id` int unsigned not null, `created_at` datetime not null, `snapshot` json not null, `deleted` tinyint(1) not null, `hidden` tinyint(1) not null, `summary` varchar(255) not null, `event` enum('Created', 'Updated', 'Deleted') not null, `version` int not null, `entry_type` enum('Translation') not null, `translation_id` int unsigned null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `revisions` add index `revisions_commit_id_index`(`commit_id`);',
		);
		this.addSql(
			'alter table `revisions` add index `revisions_actor_id_index`(`actor_id`);',
		);
		this.addSql(
			'alter table `revisions` add index `revisions_entry_type_index`(`entry_type`);',
		);
		this.addSql(
			'alter table `revisions` add index `revisions_translation_id_index`(`translation_id`);',
		);

		this.addSql(
			'alter table `revisions` add constraint `revisions_commit_id_foreign` foreign key (`commit_id`) references `commits` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `revisions` add constraint `revisions_actor_id_foreign` foreign key (`actor_id`) references `users` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `revisions` add constraint `revisions_translation_id_foreign` foreign key (`translation_id`) references `translations` (`id`) on update cascade on delete set null;',
		);

		this.addSql(
			'alter table `translations` add `tags` text not null, add `version` int not null;',
		);
	}

	async down(): Promise<void> {
		this.addSql(
			'alter table `revisions` drop foreign key `revisions_commit_id_foreign`;',
		);

		this.addSql('drop table if exists `commits`;');

		this.addSql('drop table if exists `revisions`;');

		this.addSql('alter table `translations` drop `tags`;');
		this.addSql('alter table `translations` drop `version`;');

		this.addSql(
			'create table `revisions` (`id` int unsigned not null auto_increment primary key) default character set utf8mb4 engine = InnoDB;',
		);

		this.addSql(
			"create table `change_log_entries` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `revision_id` int unsigned not null, `actor_id` int unsigned not null, `action_type` enum('Created', 'Updated', 'Deleted') not null, `text` text not null, `entry_type` enum('User', 'Translation', 'Quote', 'Artist', 'Work') not null, `translation_id` int unsigned null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `change_log_entries` add index `change_log_entries_revision_id_index`(`revision_id`);',
		);
		this.addSql(
			'alter table `change_log_entries` add index `change_log_entries_actor_id_index`(`actor_id`);',
		);
		this.addSql(
			'alter table `change_log_entries` add index `change_log_entries_entry_type_index`(`entry_type`);',
		);
		this.addSql(
			'alter table `change_log_entries` add index `change_log_entries_translation_id_index`(`translation_id`);',
		);

		this.addSql(
			"create table `change_log_changes` (`id` int unsigned not null auto_increment primary key, `change_log_entry_id` int unsigned not null, `key` enum('Translation_Headword', 'Translation_Locale', 'Translation_Reading', 'Translation_Yamatokotoba', 'Translation_Category', 'Translation_Tags') not null, `value` text not null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `change_log_changes` add index `change_log_changes_change_log_entry_id_index`(`change_log_entry_id`);',
		);

		this.addSql(
			'alter table `change_log_entries` add constraint `change_log_entries_revision_id_foreign` foreign key (`revision_id`) references `revisions` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `change_log_entries` add constraint `change_log_entries_actor_id_foreign` foreign key (`actor_id`) references `users` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `change_log_entries` add constraint `change_log_entries_translation_id_foreign` foreign key (`translation_id`) references `translations` (`id`) on update cascade on delete set null;',
		);

		this.addSql(
			'alter table `change_log_changes` add constraint `change_log_changes_change_log_entry_id_foreign` foreign key (`change_log_entry_id`) references `change_log_entries` (`id`) on update cascade;',
		);
	}
}
