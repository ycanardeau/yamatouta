import { Migration } from '@mikro-orm/migrations';

export class Migration20220603061123 extends Migration {
	async up(): Promise<void> {
		this.addSql('alter table `revisions` modify `snapshot` text not null;');
	}

	async down(): Promise<void> {
		this.addSql('alter table `revisions` modify `snapshot` json not null;');
	}
}
