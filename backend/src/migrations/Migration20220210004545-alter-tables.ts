import { Migration } from '@mikro-orm/migrations';

export class Migration20220210004545 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'alter table `inishienomanabi_search_index` add constraint `inishienomanabi_search_index_translation_id_foreign` foreign key (`translation_id`) references `inishienomanabi_translations` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `translation_search_index` add constraint `translation_search_index_translation_id_foreign` foreign key (`translation_id`) references `translations` (`id`) on update cascade;',
		);

		this.addSql('alter table `sessions` modify `sess` json not null;');
	}

	async down(): Promise<void> {
		this.addSql(
			'alter table `inishienomanabi_search_index` drop foreign key `inishienomanabi_search_index_translation_id_foreign`;',
		);

		this.addSql(
			'alter table `translation_search_index` drop foreign key `translation_search_index_translation_id_foreign`;',
		);

		this.addSql('alter table `sessions` modify `sess` longtext not null;');
	}
}
