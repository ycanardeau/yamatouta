import { Migration } from '@mikro-orm/migrations';

export class Migration20220129071154 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'alter table `audit_log_entries` add `old_value` text null, add `new_value` text null;',
		);
		this.addSql(
			"alter table `audit_log_entries` modify `action` enum('user.create', 'user.failed_login', 'user.login', 'translation.create', 'user.rename', 'user.change_email', 'user.change_password') not null;",
		);
		this.addSql('alter table `audit_log_entries` drop `actor_name`;');
		this.addSql('alter table `audit_log_entries` drop `user_name`;');
	}
}
