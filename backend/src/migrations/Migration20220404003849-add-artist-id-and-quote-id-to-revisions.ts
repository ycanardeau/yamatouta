import { Migration } from '@mikro-orm/migrations';

export class Migration20220404003849 extends Migration {
	async up(): Promise<void> {
		this.addSql('alter table `artists` add `version` int not null;');

		this.addSql('alter table `quotes` add `version` int not null;');

		this.addSql(
			'alter table `revisions` add `artist_id` int unsigned null, add `quote_id` int unsigned null;',
		);
		this.addSql(
			"alter table `revisions` modify `entry_type` enum('Translation', 'Artist', 'Quote') not null;",
		);
		this.addSql(
			'alter table `revisions` add constraint `revisions_artist_id_foreign` foreign key (`artist_id`) references `artists` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `revisions` add constraint `revisions_quote_id_foreign` foreign key (`quote_id`) references `quotes` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `revisions` add index `revisions_artist_id_index`(`artist_id`);',
		);
		this.addSql(
			'alter table `revisions` add index `revisions_quote_id_index`(`quote_id`);',
		);

		this.addSql(
			'alter table `quotes` drop foreign key `quotes_artist_id_foreign`;',
		);

		this.addSql(
			'alter table `quotes` modify `artist_id` int unsigned not null;',
		);
		this.addSql(
			'alter table `quotes` drop index `quotes_author_type_index`;',
		);
		this.addSql('alter table `quotes` drop `author_type`;');
		this.addSql(
			'alter table `quotes` add constraint `quotes_artist_id_foreign` foreign key (`artist_id`) references `artists` (`id`) on update cascade;',
		);
	}

	async down(): Promise<void> {
		this.addSql(
			'alter table `quotes` drop foreign key `quotes_artist_id_foreign`;',
		);

		this.addSql(
			"alter table `quotes` add `author_type` enum('Artist', 'User') not null;",
		);
		this.addSql(
			'alter table `quotes` modify `artist_id` int unsigned null;',
		);
		this.addSql(
			'alter table `quotes` add constraint `quotes_artist_id_foreign` foreign key (`artist_id`) references `artists` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `quotes` add index `quotes_author_type_index`(`author_type`);',
		);

		this.addSql(
			'alter table `revisions` drop foreign key `revisions_artist_id_foreign`;',
		);
		this.addSql(
			'alter table `revisions` drop foreign key `revisions_quote_id_foreign`;',
		);

		this.addSql(
			"alter table `revisions` modify `entry_type` enum('Translation') not null;",
		);
		this.addSql(
			'alter table `revisions` drop index `revisions_artist_id_index`;',
		);
		this.addSql(
			'alter table `revisions` drop index `revisions_quote_id_index`;',
		);
		this.addSql('alter table `revisions` drop `artist_id`;');
		this.addSql('alter table `revisions` drop `quote_id`;');

		this.addSql('alter table `artists` drop `version`;');

		this.addSql('alter table `quotes` drop `version`;');
	}
}
