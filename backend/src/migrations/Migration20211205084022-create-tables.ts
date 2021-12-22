import { Migration } from '@mikro-orm/migrations';

export class Migration20211205084022 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			"create table `artists` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted` tinyint(1) not null, `hidden` tinyint(1) not null, `name` varchar(255) not null, `artist_type` enum('person', 'group', 'other', 'character') not null) default character set utf8mb4 engine = InnoDB;",
		);

		this.addSql(
			"create table `quotes` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted` tinyint(1) not null, `hidden` tinyint(1) not null, `quote_type` enum('word', 'haiku', 'tanka', 'lyrics', 'other') not null, `text` varchar(2048) not null, `phrase_count` int(11) not null, `transcription` varchar(255) null, `locale` varchar(85) null, `author_type` enum('artist', 'user') not null, `source_url` varchar(255) null, `artist_id` int(11) unsigned null, `year` int(11) null, `month` int(11) null, `day` int(11) null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `quotes` add index `quotes_author_type_index`(`author_type`);',
		);
		this.addSql(
			'alter table `quotes` add index `quotes_artist_id_index`(`artist_id`);',
		);

		this.addSql(
			'alter table `quotes` add constraint `quotes_artist_id_foreign` foreign key (`artist_id`) references `artists` (`id`) on update cascade on delete set null;',
		);
	}
}
