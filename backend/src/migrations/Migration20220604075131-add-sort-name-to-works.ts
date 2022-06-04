import { Migration } from '@mikro-orm/migrations';

export class Migration20220604075131 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'alter table `works` add `sort_name` varchar(255) not null;',
		);
	}

	async down(): Promise<void> {
		this.addSql('alter table `works` drop `sort_name`;');
	}
}
