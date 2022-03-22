import { Migration } from '@mikro-orm/migrations';

export class Migration20220322024316 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'alter table `translations` change `tags` `inishienomanabi_tags` text not null;',
		);
	}

	async down(): Promise<void> {
		this.addSql(
			'alter table `translations` change `inishienomanabi_tags` `tags` text not null;',
		);
	}
}
