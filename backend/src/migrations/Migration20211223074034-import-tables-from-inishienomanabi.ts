import { Migration } from '@mikro-orm/migrations';

export class Migration20211223074034 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table `inishienomanabi_tags` (`tag_name` varchar(64) not null, `count` int(11) not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `inishienomanabi_tags` add primary key `inishienomanabi_tags_pkey`(`tag_name`);',
		);

		this.addSql(
			'create table `inishienomanabi_translations` (`id` int unsigned not null auto_increment primary key, `status` varchar(255) not null, `japanese` varchar(255) not null, `reading` varchar(255) not null, `yamatokotoba` varchar(255) not null, `category` varchar(255) null, `tags` text not null, `description` text null, `user_id` int(11) unsigned null, `ip` varchar(255) not null, `source` text null, `score` int(11) not null, `creation_date` datetime not null, `last_editor_user_id` int(11) unsigned null, `last_edit_date` datetime not null, `activation_user_id` int(11) unsigned null, `activation_date` datetime not null, `vote_count` int(11) not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `inishienomanabi_translations` add index `inishienomanabi_translations_user_id_index`(`user_id`);',
		);
		this.addSql(
			'alter table `inishienomanabi_translations` add index `inishienomanabi_translations_last_editor_user_id_index`(`last_editor_user_id`);',
		);
		this.addSql(
			'alter table `inishienomanabi_translations` add index `inishienomanabi_translations_activation_user_id_index`(`activation_user_id`);',
		);

		this.addSql(
			'create table `inishienomanabi_comments` (`id` int unsigned not null auto_increment primary key, `translation_id` int(11) unsigned not null, `content` text not null, `user_id` int(11) unsigned not null, `creation_date` datetime not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `inishienomanabi_comments` add index `inishienomanabi_comments_translation_id_index`(`translation_id`);',
		);
		this.addSql(
			'alter table `inishienomanabi_comments` add index `inishienomanabi_comments_user_id_index`(`user_id`);',
		);

		this.addSql(
			'create table `inishienomanabi_revisions` (`id` int unsigned not null auto_increment primary key, `translation_id` int(11) unsigned not null, `japanese` varchar(255) not null, `reading` varchar(255) not null, `yamatokotoba` varchar(255) not null, `category` varchar(255) null, `tags` varchar(255) null, `user_id` int(11) unsigned not null, `creation_date` datetime not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `inishienomanabi_revisions` add index `inishienomanabi_revisions_translation_id_index`(`translation_id`);',
		);
		this.addSql(
			'alter table `inishienomanabi_revisions` add index `inishienomanabi_revisions_user_id_index`(`user_id`);',
		);

		this.addSql(
			'create table `inishienomanabi_search_index` (`id` int unsigned not null auto_increment primary key, `translation_id` int(11) unsigned not null, `japanese` text not null, `reading` text not null, `yamatokotoba` text not null, `category` varchar(255) not null, `tags` text not null) default character set utf8mb4 engine = MyISAM;',
		);
		this.addSql(
			'alter table `inishienomanabi_search_index` add index `inishienomanabi_search_index_translation_id_index`(`translation_id`);',
		);
		this.addSql(
			'alter table `inishienomanabi_search_index` add unique `inishienomanabi_search_index_translation_id_unique`(`translation_id`);',
		);

		this.addSql(
			'create table `inishienomanabi_suggested_edits` (`id` int unsigned not null auto_increment primary key, `action` varchar(255) not null, `status` varchar(255) not null, `translation_id` int(11) unsigned not null, `japanese` varchar(255) not null, `reading` varchar(255) not null, `yamatokotoba` varchar(255) not null, `category` varchar(255) null, `tags` varchar(255) null, `user_id` int(11) unsigned not null, `creation_date` datetime not null, `vote_count` int(11) not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `inishienomanabi_suggested_edits` add index `inishienomanabi_suggested_edits_translation_id_index`(`translation_id`);',
		);
		this.addSql(
			'alter table `inishienomanabi_suggested_edits` add index `inishienomanabi_suggested_edits_user_id_index`(`user_id`);',
		);

		this.addSql(
			'create table `inishienomanabi_reviews` (`id` int unsigned not null auto_increment primary key, `action` varchar(255) not null, `translation_id` int(11) unsigned not null, `suggested_edit_id` int(11) unsigned not null, `user_id` int(11) unsigned not null, `summary` text not null, `creation_date` datetime not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `inishienomanabi_reviews` add index `inishienomanabi_reviews_translation_id_index`(`translation_id`);',
		);
		this.addSql(
			'alter table `inishienomanabi_reviews` add index `inishienomanabi_reviews_suggested_edit_id_index`(`suggested_edit_id`);',
		);
		this.addSql(
			'alter table `inishienomanabi_reviews` add index `inishienomanabi_reviews_user_id_index`(`user_id`);',
		);

		this.addSql(
			'create table `inishienomanabi_votes` (`id` int unsigned not null auto_increment primary key, `translation_id` int(11) unsigned not null, `user_id` int(11) unsigned not null, `action` varchar(20) not null, `creation_date` datetime not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `inishienomanabi_votes` add index `inishienomanabi_votes_translation_id_index`(`translation_id`);',
		);
		this.addSql(
			'alter table `inishienomanabi_votes` add index `inishienomanabi_votes_user_id_index`(`user_id`);',
		);

		this.addSql(
			'alter table `inishienomanabi_translations` add constraint `inishienomanabi_translations_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `inishienomanabi_translations` add constraint `inishienomanabi_translations_last_editor_user_id_foreign` foreign key (`last_editor_user_id`) references `users` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `inishienomanabi_translations` add constraint `inishienomanabi_translations_activation_user_id_foreign` foreign key (`activation_user_id`) references `users` (`id`) on update cascade on delete set null;',
		);

		this.addSql(
			'alter table `inishienomanabi_comments` add constraint `inishienomanabi_comments_translation_id_foreign` foreign key (`translation_id`) references `inishienomanabi_translations` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `inishienomanabi_comments` add constraint `inishienomanabi_comments_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `inishienomanabi_revisions` add constraint `inishienomanabi_revisions_translation_id_foreign` foreign key (`translation_id`) references `inishienomanabi_translations` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `inishienomanabi_revisions` add constraint `inishienomanabi_revisions_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `inishienomanabi_search_index` add constraint `inishienomanabi_search_index_translation_id_foreign` foreign key (`translation_id`) references `inishienomanabi_translations` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `inishienomanabi_suggested_edits` add constraint `inishienomanabi_suggested_edits_translation_id_foreign` foreign key (`translation_id`) references `inishienomanabi_translations` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `inishienomanabi_suggested_edits` add constraint `inishienomanabi_suggested_edits_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `inishienomanabi_reviews` add constraint `inishienomanabi_reviews_translation_id_foreign` foreign key (`translation_id`) references `inishienomanabi_translations` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `inishienomanabi_reviews` add constraint `inishienomanabi_reviews_suggested_edit_id_foreign` foreign key (`suggested_edit_id`) references `inishienomanabi_suggested_edits` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `inishienomanabi_reviews` add constraint `inishienomanabi_reviews_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `inishienomanabi_votes` add constraint `inishienomanabi_votes_translation_id_foreign` foreign key (`translation_id`) references `inishienomanabi_translations` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `inishienomanabi_votes` add constraint `inishienomanabi_votes_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;',
		);
	}
}
