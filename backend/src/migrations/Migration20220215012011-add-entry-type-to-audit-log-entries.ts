import { Migration } from '@mikro-orm/migrations';

export class Migration20220215012011 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			"alter table `audit_log_entries` add `entry_type` enum('user', 'translation', 'quote', 'artist', 'work') not null;",
		);
		this.addSql(
			'alter table `audit_log_entries` add index `audit_log_entries_entry_type_index`(`entry_type`);',
		);
	}

	async down(): Promise<void> {
		this.addSql(
			'alter table `audit_log_entries` drop index `audit_log_entries_entry_type_index`;',
		);
		this.addSql('alter table `audit_log_entries` drop `entry_type`;');
	}
}
