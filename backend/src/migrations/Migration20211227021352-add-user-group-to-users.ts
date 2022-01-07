import { Migration } from '@mikro-orm/migrations';

export class Migration20211227021352 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			"alter table `users` add `user_group` enum('limited_user', 'user', 'advanced_user', 'mod', 'senior_mod', 'admin') not null;",
		);
	}
}
