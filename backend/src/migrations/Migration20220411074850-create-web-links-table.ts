import { Migration } from '@mikro-orm/migrations';

export class Migration20220411074850 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table `web_addresses` (`id` int unsigned not null auto_increment primary key, `url` text not null, `scheme` varchar(255) not null, `host` varchar(255) not null, `port` varchar(255) not null, `path` text not null, `query` text not null, `fragment` text not null) default character set utf8mb4 engine = InnoDB;',
		);

		this.addSql(
			"create table `web_links` (`id` int unsigned not null auto_increment primary key, `address_id` int unsigned not null, `title` varchar(255) not null, `category` enum('Unspecified', 'Official', 'Commercial', 'Reference', 'Other') not null, `entry_type` enum('Translation', 'Artist', 'Quote', 'Work') not null, `translation_id` int unsigned null, `artist_id` int unsigned null, `quote_id` int unsigned null, `work_id` int unsigned null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `web_links` add index `web_links_address_id_index`(`address_id`);',
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
			'alter table `web_links` add constraint `web_links_address_id_foreign` foreign key (`address_id`) references `web_addresses` (`id`) on update cascade;',
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

		this.addSql(
			'alter table `inishienomanabi_search_index` drop index `inishienomanabi_search_index_translation_id_index`;',
		);

		this.addSql(
			'alter table `translation_search_index` drop index `translation_search_index_translation_id_index`;',
		);

		this.addSql(
			'alter table `web_addresses` add `created_at` datetime not null, add `updated_at` datetime not null, add `reference_count` int not null;',
		);

		this.addSql(
			'alter table `web_addresses` add `actor_id` int unsigned not null;',
		);
		this.addSql(
			'alter table `web_addresses` add constraint `web_addresses_actor_id_foreign` foreign key (`actor_id`) references `users` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `web_addresses` add index `web_addresses_actor_id_index`(`actor_id`);',
		);
	}

	async down(): Promise<void> {
		this.addSql(
			'alter table `web_addresses` drop foreign key `web_addresses_actor_id_foreign`;',
		);

		this.addSql(
			'alter table `web_addresses` drop index `web_addresses_actor_id_index`;',
		);
		this.addSql('alter table `web_addresses` drop `actor_id`;');

		this.addSql('alter table `web_addresses` drop `created_at`;');
		this.addSql('alter table `web_addresses` drop `updated_at`;');
		this.addSql('alter table `web_addresses` drop `reference_count`;');

		this.addSql(
			'alter table `web_links` drop foreign key `web_links_address_id_foreign`;',
		);

		this.addSql('drop table if exists `web_addresses`;');

		this.addSql('drop table if exists `web_links`;');

		this.addSql(
			'alter table `inishienomanabi_search_index` add index `inishienomanabi_search_index_translation_id_index`(`translation_id`);',
		);

		this.addSql(
			'alter table `translation_search_index` add index `translation_search_index_translation_id_index`(`translation_id`);',
		);
	}
}
