import { Migration } from '@mikro-orm/migrations';

export class Migration20220106105525 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			"create table `translations` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted` tinyint(1) not null, `hidden` tinyint(1) not null, `headword` varchar(255) not null, `locale` varchar(85) null, `reading` varchar(255) null, `yamatokotoba` varchar(255) not null, `category` enum('noun', 'verb', 'adjective', 'adjectivalNoun', 'adverb', 'postpositionalParticle', 'auxiliaryVerb', 'attributive', 'conjunction', 'prefix', 'suffix', 'interjection', 'other', 'pronoun') null, `user_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `translations` add index `translations_user_id_index`(`user_id`);',
		);

		this.addSql(
			'alter table `translations` add constraint `translations_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `audit_log_entries` add `translation_id` int(11) unsigned null;',
		);
		this.addSql(
			"alter table `audit_log_entries` modify `action` enum('user.create', 'user.failed_login', 'user.login', 'translation.create') not null;",
		);
		this.addSql(
			'alter table `audit_log_entries` add index `audit_log_entries_translation_id_index`(`translation_id`);',
		);

		this.addSql(
			'alter table `audit_log_entries` add constraint `audit_log_entries_translation_id_foreign` foreign key (`translation_id`) references `translations` (`id`) on update cascade on delete set null;',
		);

		this.addSql(
			'create table `translation_search_index` (`id` int unsigned not null auto_increment primary key, `translation_id` int(11) unsigned not null, `headword` text not null, `reading` text not null, `yamatokotoba` text not null) default character set utf8mb4 engine = MyISAM;',
		);
		this.addSql(
			'alter table `translation_search_index` add index `translation_search_index_translation_id_index`(`translation_id`);',
		);
		this.addSql(
			'alter table `translation_search_index` add unique `translation_search_index_translation_id_unique`(`translation_id`);',
		);

		this.addSql(
			'alter table `translation_search_index` add constraint `translation_search_index_translation_id_foreign` foreign key (`translation_id`) references `translations` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `translation_search_index` add fulltext index `translation_search_index_headword_reading_yamatokotoba_index`(`headword`, `reading`, `yamatokotoba`);',
		);
	}
}
