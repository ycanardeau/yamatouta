import { Migration } from '@mikro-orm/migrations';

export class Migration20211210030330 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			"create table `audit_log_entries` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `action` enum('user.create', 'user.failed_login', 'user.login') not null, `actor_id` int(11) unsigned not null, `actor_name` varchar(255) not null, `actor_ip` varchar(255) not null, `user_id` int(11) unsigned null, `user_name` varchar(255) null) default character set utf8mb4 engine = InnoDB;",
		);
		this.addSql(
			'alter table `audit_log_entries` add index `audit_log_entries_actor_id_index`(`actor_id`);',
		);
		this.addSql(
			'alter table `audit_log_entries` add index `audit_log_entries_user_id_index`(`user_id`);',
		);

		this.addSql(
			'alter table `audit_log_entries` add constraint `audit_log_entries_actor_id_foreign` foreign key (`actor_id`) references `users` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `audit_log_entries` add constraint `audit_log_entries_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete set null;',
		);
	}
}
