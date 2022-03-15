import { Migration } from '@mikro-orm/migrations';

export class Migration20220209032142 extends Migration {
	async up(): Promise<void> {
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

		this.addSql(
			"alter table `translations` modify `locale` varchar(85) not null, modify `reading` varchar(255) not null, modify `category` enum('Unspecified', 'Noun', 'Verb', 'Adjective', 'AdjectivalNoun', 'Adverb', 'PostpositionalParticle', 'AuxiliaryVerb', 'Attributive', 'Conjunction', 'Prefix', 'Suffix', 'Interjection', 'Other', 'Pronoun') not null;",
		);

		this.addSql(
			"alter table `audit_log_entries` modify `action` enum('User_Create', 'User_FailedLogin', 'User_Login', 'Translation_Create', 'User_Rename', 'User_ChangeEmail', 'User_ChangePassword', 'Translation_Update', 'Translation_Delete') not null, modify `old_value` text not null, modify `new_value` text not null;",
		);

		this.addSql(
			'alter table `quotes` modify `transcription` varchar(255) not null, modify `locale` varchar(85) not null, modify `source_url` varchar(255) not null;',
		);
	}

	async down(): Promise<void> {
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
			"alter table `translations` modify `locale` varchar(85) null, modify `reading` varchar(255) null, modify `category` enum('Noun', 'Verb', 'Adjective', 'AdjectivalNoun', 'Adverb', 'PostpositionalParticle', 'AuxiliaryVerb', 'Attributive', 'Conjunction', 'Prefix', 'Suffix', 'Interjection', 'Other', 'Pronoun') null;",
		);

		this.addSql(
			"alter table `audit_log_entries` modify `action` enum('User_Create', 'User_FailedLogin', 'User_Login', 'Translation_Create', 'User_Rename', 'User_ChangeEmail', 'User_ChangePassword') not null, modify `old_value` text null, modify `new_value` text null;",
		);

		this.addSql(
			'alter table `quotes` modify `transcription` varchar(255) null, modify `locale` varchar(85) null, modify `source_url` varchar(255) null;',
		);
	}
}
