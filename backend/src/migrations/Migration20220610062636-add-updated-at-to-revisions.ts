import { Migration } from '@mikro-orm/migrations';

export class Migration20220610062636 extends Migration {
	async up(): Promise<void> {
		this.addSql('alter table `revisions` add `updated_at` datetime null;');

		this.addSql('update revisions set updated_at = created_at;');

		this.addSql(
			'alter table `revisions` modify `updated_at` datetime not null;',
		);
	}

	async down(): Promise<void> {
		this.addSql('alter table `revisions` drop `updated_at`;');
	}
}
