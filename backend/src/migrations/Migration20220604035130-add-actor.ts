import { Migration } from '@mikro-orm/migrations';

export class Migration20220604035130 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'alter table `translations` drop foreign key `translations_user_id_foreign`;',
		);

		this.addSql('alter table `works` add `actor_id` int unsigned null;');
		this.addSql(
			'alter table `works` add constraint `works_actor_id_foreign` foreign key (`actor_id`) references `users` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `works` add index `works_actor_id_index`(`actor_id`);',
		);

		this.addSql(
			'alter table `translations` drop index `translations_user_id_index`;',
		);
		this.addSql(
			'alter table `translations` change `user_id` `actor_id` int unsigned not null;',
		);
		this.addSql(
			'alter table `translations` add constraint `translations_actor_id_foreign` foreign key (`actor_id`) references `users` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `translations` add index `translations_actor_id_index`(`actor_id`);',
		);

		this.addSql('alter table `artists` add `actor_id` int unsigned null;');
		this.addSql(
			'alter table `artists` add constraint `artists_actor_id_foreign` foreign key (`actor_id`) references `users` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `artists` add index `artists_actor_id_index`(`actor_id`);',
		);

		this.addSql('alter table `quotes` add `actor_id` int unsigned null;');
		this.addSql(
			'alter table `quotes` add constraint `quotes_actor_id_foreign` foreign key (`actor_id`) references `users` (`id`) on update cascade on delete set null;',
		);
		this.addSql(
			'alter table `quotes` add index `quotes_actor_id_index`(`actor_id`);',
		);

		this.addSql(`
			update artists a
			left join revisions r on r.artist_id = a.id
			set a.actor_id = r.actor_id
			where r.entry_type = 'Artist' and r.version = 1;
		`);
		this.addSql(`
			update quotes q
			left join revisions r on r.quote_id = q.id
			set q.actor_id = r.actor_id
			where r.entry_type = 'Quote' and r.version = 1;
		`);
		this.addSql(`
			update works w
			left join revisions r on r.work_id = w.id
			set w.actor_id = r.actor_id
			where r.entry_type = 'Work' and r.version = 1;
		`);

		this.addSql(
			'alter table `works` drop foreign key `works_actor_id_foreign`;',
		);

		this.addSql(
			'alter table `artists` drop foreign key `artists_actor_id_foreign`;',
		);

		this.addSql(
			'alter table `quotes` drop foreign key `quotes_actor_id_foreign`;',
		);

		this.addSql(
			'alter table `works` modify `actor_id` int unsigned not null;',
		);
		this.addSql(
			'alter table `works` add constraint `works_actor_id_foreign` foreign key (`actor_id`) references `users` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `artists` modify `actor_id` int unsigned not null;',
		);
		this.addSql(
			'alter table `artists` add constraint `artists_actor_id_foreign` foreign key (`actor_id`) references `users` (`id`) on update cascade;',
		);

		this.addSql(
			'alter table `quotes` modify `actor_id` int unsigned not null;',
		);
		this.addSql(
			'alter table `quotes` add constraint `quotes_actor_id_foreign` foreign key (`actor_id`) references `users` (`id`) on update cascade;',
		);
	}

	async down(): Promise<void> {
		this.addSql(
			'alter table `works` drop foreign key `works_actor_id_foreign`;',
		);

		this.addSql(
			'alter table `translations` drop foreign key `translations_actor_id_foreign`;',
		);

		this.addSql(
			'alter table `artists` drop foreign key `artists_actor_id_foreign`;',
		);

		this.addSql(
			'alter table `quotes` drop foreign key `quotes_actor_id_foreign`;',
		);

		this.addSql('alter table `works` drop index `works_actor_id_index`;');
		this.addSql('alter table `works` drop `actor_id`;');

		this.addSql(
			'alter table `translations` drop index `translations_actor_id_index`;',
		);
		this.addSql(
			'alter table `translations` change `actor_id` `user_id` int unsigned not null;',
		);
		this.addSql(
			'alter table `translations` add constraint `translations_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;',
		);
		this.addSql(
			'alter table `translations` add index `translations_user_id_index`(`user_id`);',
		);

		this.addSql(
			'alter table `artists` drop index `artists_actor_id_index`;',
		);
		this.addSql('alter table `artists` drop `actor_id`;');

		this.addSql('alter table `quotes` drop index `quotes_actor_id_index`;');
		this.addSql('alter table `quotes` drop `actor_id`;');
	}
}
