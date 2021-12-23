import { Migration } from '@mikro-orm/migrations';

export class Migration20211224000755 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			"alter table `users` modify `password_hash_algorithm` enum('bcrypt', 'inishienomanabi') not null;",
		);
	}
}
