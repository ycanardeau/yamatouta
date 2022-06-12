import { Migration } from '@mikro-orm/migrations';

export class Migration20220612015056 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'alter table `user_search_index` add fulltext index `user_search_index_name_index`(`name`);',
		);

		this.addSql(
			'alter table `work_search_index` add fulltext index `work_search_index_name_index`(`name`);',
		);

		this.addSql(
			'alter table `artist_search_index` add fulltext index `artist_search_index_name_index`(`name`);',
		);

		this.addSql(
			'alter table `quote_search_index` add fulltext index `quote_search_index_text_index`(`text`);',
		);
	}

	async down(): Promise<void> {
		this.addSql(
			'alter table `user_search_index` drop index `user_search_index_name_index`;',
		);

		this.addSql(
			'alter table `work_search_index` drop index `work_search_index_name_index`;',
		);

		this.addSql(
			'alter table `artist_search_index` drop index `artist_search_index_name_index`;',
		);

		this.addSql(
			'alter table `quote_search_index` drop index `quote_search_index_text_index`;',
		);
	}
}
