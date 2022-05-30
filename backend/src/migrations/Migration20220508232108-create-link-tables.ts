import { Migration } from '@mikro-orm/migrations';

export class Migration20220508232108 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			"create table `artist_links` (`id` int unsigned not null auto_increment primary key, `link_type` enum('Unspecified', 'Quote_Work_Source', 'Translation_Work_Source', 'Work_Artist_Author', 'Work_Artist_Contributor', 'Work_Artist_Editor', 'Work_Artist_Foreword', 'Work_Artist_Publisher', 'Work_Artist_Translator') not null, `begin_date_year` int null, `ended` tinyint(1) not null, `begin_date_month` int null, `end_date_year` int null, `begin_date_day` int null, `end_date_month` int null, `end_date_day` int null, `created_at` datetime not null, `related_artist_id` int unsigned not null, `entry_type` enum('Artist', 'Work') not null, `artist_id` int unsigned null, `work_id` int unsigned null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `artist_links` add index `artist_links_related_artist_id_index`(`related_artist_id`);',
		);
		this.addSql(
			'alter table `artist_links` add index `artist_links_entry_type_index`(`entry_type`);',
		);
		this.addSql(
			'alter table `artist_links` add index `artist_links_artist_id_index`(`artist_id`);',
		);
		this.addSql(
			'alter table `artist_links` add index `artist_links_work_id_index`(`work_id`);',
		);

		this.addSql(
			"create table `work_links` (`id` int unsigned not null auto_increment primary key, `link_type` enum('Unspecified', 'Quote_Work_Source', 'Translation_Work_Source', 'Work_Artist_Author', 'Work_Artist_Contributor', 'Work_Artist_Editor', 'Work_Artist_Foreword', 'Work_Artist_Publisher', 'Work_Artist_Translator') not null, `begin_date_year` int null, `ended` tinyint(1) not null, `begin_date_month` int null, `end_date_year` int null, `begin_date_day` int null, `end_date_month` int null, `end_date_day` int null, `created_at` datetime not null, `related_work_id` int unsigned not null, `entry_type` enum('Quote', 'Translation', 'Work') not null, `quote_id` int unsigned null, `translation_id` int unsigned null, `work_id` int unsigned null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `work_links` add index `work_links_related_work_id_index`(`related_work_id`);',
		);
		this.addSql(
			'alter table `work_links` add index `work_links_entry_type_index`(`entry_type`);',
		);
		this.addSql(
			'alter table `work_links` add index `work_links_quote_id_index`(`quote_id`);',
		);
		this.addSql(
			'alter table `work_links` add index `work_links_translation_id_index`(`translation_id`);',
		);
		this.addSql(
			'alter table `work_links` add index `work_links_work_id_index`(`work_id`);',
		);

		this.addSql(
			'alter table `artist_links` add constraint `artist_links_related_artist_id_foreign` foreign key (`related_artist_id`) references `artists` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `artist_links` add constraint `artist_links_artist_id_foreign` foreign key (`artist_id`) references `artists` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `artist_links` add constraint `artist_links_work_id_foreign` foreign key (`work_id`) references `works` (`id`) on update cascade on delete set null;',
		);

		this.addSql(
			'alter table `work_links` add constraint `work_links_related_work_id_foreign` foreign key (`related_work_id`) references `works` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `work_links` add constraint `work_links_quote_id_foreign` foreign key (`quote_id`) references `quotes` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `work_links` add constraint `work_links_translation_id_foreign` foreign key (`translation_id`) references `translations` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `work_links` add constraint `work_links_work_id_foreign` foreign key (`work_id`) references `works` (`id`) on update cascade on delete set null;',
		);
	}

	async down(): Promise<void> {
		this.addSql('drop table if exists `artist_links`;');

		this.addSql('drop table if exists `work_links`;');
	}
}
