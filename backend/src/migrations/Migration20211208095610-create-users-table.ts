import { Migration } from '@mikro-orm/migrations';

export class Migration20211208095610 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table `users` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted` tinyint(1) not null, `hidden` tinyint(1) not null, `name` varchar(255) not null, `email` varchar(255) not null, `normalized_email` varchar(255) not null, `email_confirmed` tinyint(1) not null, `password_hash_algorithm` varchar(255) not null, `salt` varchar(255) not null, `password_hash` varchar(255) not null, `security_stamp` varchar(255) null, `concurrency_stamp` varchar(255) null, `phone_number` varchar(255) null, `phone_number_confirmed` tinyint(1) not null, `two_factor_enabled` tinyint(1) not null, `lockout_end` datetime null, `lockout_enabled` tinyint(1) not null, `access_failed_count` int(11) not null) default character set utf8mb4 engine = InnoDB;',
		);
	}
}
