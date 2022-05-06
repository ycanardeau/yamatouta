import { Migration } from '@mikro-orm/migrations';

export class Migration20220502012919 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table `web_address_hosts` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `hostname` varchar(255) not null, `reference_count` int not null, `actor_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
		);
		this.addSql(
			'alter table `web_address_hosts` add index `web_address_hosts_actor_id_index`(`actor_id`);',
		);

		this.addSql(
			'alter table `web_address_hosts` add constraint `web_address_hosts_actor_id_foreign` foreign key (`actor_id`) references `users` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `web_addresses` add `host_id` int unsigned not null;',
		);
		this.addSql(
			'alter table `web_addresses` add constraint `web_addresses_host_id_foreign` foreign key (`host_id`) references `web_address_hosts` (`id`) on update cascade;',
		);
		this.addSql('alter table `web_addresses` drop `host`;');
		this.addSql(
			'alter table `web_addresses` add index `web_addresses_host_id_index`(`host_id`);',
		);
	}

	async down(): Promise<void> {
		this.addSql(
			'alter table `web_addresses` drop foreign key `web_addresses_host_id_foreign`;',
		);

		this.addSql('drop table if exists `web_address_hosts`;');

		this.addSql(
			'alter table `web_addresses` add `host` varchar(255) not null;',
		);
		this.addSql(
			'alter table `web_addresses` drop index `web_addresses_host_id_index`;',
		);
		this.addSql('alter table `web_addresses` drop `host_id`;');
	}
}
