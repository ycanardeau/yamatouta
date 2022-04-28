import { Migration } from '@mikro-orm/migrations';

export class Migration20220411074850 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table `urls` (`id` int unsigned not null auto_increment primary key, `url` text not null, `scheme` varchar(255) not null, `host` varchar(255) not null, `port` varchar(255) not null, `path` text not null, `query` text not null, `fragment` text not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql('alter table `urls` add unique `urls_url_unique`(`url`);');

		this.addSql(
			"create table `web_links` (`id` int unsigned not null auto_increment primary key, `url_id` int unsigned not null, `title` varchar(255) not null, `category` enum('Unspecified', 'Official', 'Commercial', 'Reference', 'Other') not null, `entry_type` enum('Translation', 'Artist', 'Quote', 'Work') not null, `translation_id` int unsigned null, `artist_id` int unsigned null, `quote_id` int unsigned null, `work_id` int unsigned null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `web_links` add index `web_links_url_id_index`(`url_id`);',
		);
		this.addSql(
			'alter table `web_links` add index `web_links_entry_type_index`(`entry_type`);',
		);
		this.addSql(
			'alter table `web_links` add index `web_links_translation_id_index`(`translation_id`);',
		);
		this.addSql(
			'alter table `web_links` add index `web_links_artist_id_index`(`artist_id`);',
		);
		this.addSql(
			'alter table `web_links` add index `web_links_quote_id_index`(`quote_id`);',
		);
		this.addSql(
			'alter table `web_links` add index `web_links_work_id_index`(`work_id`);',
		);

		this.addSql(
			'alter table `web_links` add constraint `web_links_url_id_foreign` foreign key (`url_id`) references `urls` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `web_links` add constraint `web_links_translation_id_foreign` foreign key (`translation_id`) references `translations` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `web_links` add constraint `web_links_artist_id_foreign` foreign key (`artist_id`) references `artists` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `web_links` add constraint `web_links_quote_id_foreign` foreign key (`quote_id`) references `quotes` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `web_links` add constraint `web_links_work_id_foreign` foreign key (`work_id`) references `works` (`id`) on update cascade on delete set null;',
		);
	}

	async down(): Promise<void> {
		this.addSql(
			'alter table `web_links` drop foreign key `web_links_url_id_foreign`;',
		);

		this.addSql('drop table if exists `urls`;');

		this.addSql('drop table if exists `web_links`;');
	}
}
