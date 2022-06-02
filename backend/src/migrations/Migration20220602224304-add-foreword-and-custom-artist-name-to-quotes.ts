import { Migration } from '@mikro-orm/migrations';

export class Migration20220602224304 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'alter table `quotes` add `foreword` text not null, add `custom_artist_name` varchar(255) not null;',
		);
		this.addSql(
			'alter table `quotes` modify `text` text not null, modify `transcription` text not null;',
		);
	}

	async down(): Promise<void> {
		this.addSql(
			'alter table `quotes` modify `text` varchar(2048) not null, modify `transcription` varchar(255) not null;',
		);
		this.addSql('alter table `quotes` drop `foreword`;');
		this.addSql('alter table `quotes` drop `custom_artist_name`;');
	}
}
