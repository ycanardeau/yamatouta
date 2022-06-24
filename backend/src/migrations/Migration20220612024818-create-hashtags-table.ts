import { Migration } from '@mikro-orm/migrations';

export class Migration20220612024818 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table `hashtags` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted` tinyint(1) not null, `hidden` tinyint(1) not null, `name` varchar(100) not null, `reference_count` int not null, `actor_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `hashtags` add unique `hashtags_name_unique`(`name`);',
		);
		this.addSql(
			'alter table `hashtags` add index `hashtags_actor_id_index`(`actor_id`);',
		);

		this.addSql(
			"create table `hashtag_links` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `related_hashtag_id` int unsigned not null, `label` varchar(100) not null, `entry_type` enum('Artist', 'Quote', 'Translation', 'Work') not null, `artist_id` int unsigned null, `quote_id` int unsigned null, `translation_id` int unsigned null, `work_id` int unsigned null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `hashtag_links` add index `hashtag_links_related_hashtag_id_index`(`related_hashtag_id`);',
		);
		this.addSql(
			'alter table `hashtag_links` add index `hashtag_links_entry_type_index`(`entry_type`);',
		);
		this.addSql(
			'alter table `hashtag_links` add index `hashtag_links_artist_id_index`(`artist_id`);',
		);
		this.addSql(
			'alter table `hashtag_links` add index `hashtag_links_quote_id_index`(`quote_id`);',
		);
		this.addSql(
			'alter table `hashtag_links` add index `hashtag_links_translation_id_index`(`translation_id`);',
		);
		this.addSql(
			'alter table `hashtag_links` add index `hashtag_links_work_id_index`(`work_id`);',
		);

		this.addSql(
			'alter table `hashtags` add constraint `hashtags_actor_id_foreign` foreign key (`actor_id`) references `users` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `hashtag_links` add constraint `hashtag_links_related_hashtag_id_foreign` foreign key (`related_hashtag_id`) references `hashtags` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `hashtag_links` add constraint `hashtag_links_artist_id_foreign` foreign key (`artist_id`) references `artists` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `hashtag_links` add constraint `hashtag_links_quote_id_foreign` foreign key (`quote_id`) references `quotes` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `hashtag_links` add constraint `hashtag_links_translation_id_foreign` foreign key (`translation_id`) references `translations` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `hashtag_links` add constraint `hashtag_links_work_id_foreign` foreign key (`work_id`) references `works` (`id`) on update cascade on delete set null;',
		);
	}

	async down(): Promise<void> {
		this.addSql(
			'alter table `hashtag_links` drop foreign key `hashtag_links_related_hashtag_id_foreign`;',
		);

		this.addSql('drop table if exists `hashtags`;');

		this.addSql('drop table if exists `hashtag_links`;');
	}
}
