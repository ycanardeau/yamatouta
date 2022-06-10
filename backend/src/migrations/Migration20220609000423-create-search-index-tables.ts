import { Migration } from '@mikro-orm/migrations';

export class Migration20220609000423 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table `user_search_index` (`id` int unsigned not null auto_increment primary key, `user_id` int unsigned not null, `name` text not null) default character set utf8mb4 engine = MyISAM;',
		);
		this.addSql(
			'alter table `user_search_index` add unique `user_search_index_user_id_unique`(`user_id`);',
		);

		this.addSql(
			'create table `work_search_index` (`id` int unsigned not null auto_increment primary key, `work_id` int unsigned not null, `name` text not null) default character set utf8mb4 engine = MyISAM;',
		);
		this.addSql(
			'alter table `work_search_index` add unique `work_search_index_work_id_unique`(`work_id`);',
		);

		this.addSql(
			'create table `artist_search_index` (`id` int unsigned not null auto_increment primary key, `artist_id` int unsigned not null, `name` text not null) default character set utf8mb4 engine = MyISAM;',
		);
		this.addSql(
			'alter table `artist_search_index` add unique `artist_search_index_artist_id_unique`(`artist_id`);',
		);

		this.addSql(
			'create table `quote_search_index` (`id` int unsigned not null auto_increment primary key, `quote_id` int unsigned not null, `text` text not null) default character set utf8mb4 engine = MyISAM;',
		);
		this.addSql(
			'alter table `quote_search_index` add unique `quote_search_index_quote_id_unique`(`quote_id`);',
		);

		this.addSql(
			'alter table `user_search_index` add constraint `user_search_index_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `work_search_index` add constraint `work_search_index_work_id_foreign` foreign key (`work_id`) references `works` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `artist_search_index` add constraint `artist_search_index_artist_id_foreign` foreign key (`artist_id`) references `artists` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `quote_search_index` add constraint `quote_search_index_quote_id_foreign` foreign key (`quote_id`) references `quotes` (`id`) on update cascade;',
		);

		this.addSql(`
			insert into artist_search_index (id, artist_id, name)
			select id, id, '' from artists;
		`);
		this.addSql(`
			insert into quote_search_index (id, quote_id, text)
			select id, id, '' from quotes;
		`);
		this.addSql(`
			insert into user_search_index (id, user_id, name)
			select id, id, '' from users;
		`);
		this.addSql(`
			insert into work_search_index (id, work_id, name)
			select id, id, '' from works;
		`);
	}

	async down(): Promise<void> {
		this.addSql('drop table if exists `user_search_index`;');

		this.addSql('drop table if exists `work_search_index`;');

		this.addSql('drop table if exists `artist_search_index`;');

		this.addSql('drop table if exists `quote_search_index`;');
	}
}
