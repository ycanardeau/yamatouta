import { Migration } from '@mikro-orm/migrations';

export class Migration20211205084022 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table "artists" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted" bool not null, "hidden" bool not null, "name" varchar(255) not null, "artist_type" text check ("artist_type" in (\'person\', \'group\', \'other\', \'character\')) not null);',
		);

		this.addSql(
			'create table "quotes" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted" bool not null, "hidden" bool not null, "quote_type" text check ("quote_type" in (\'word\', \'haiku\', \'tanka\', \'lyrics\', \'other\')) not null, "text" varchar(2048) not null, "phrase_count" int4 not null, "transcription" varchar(255) null, "locale" varchar(85) null, "author_type" text check ("author_type" in (\'artist\', \'user\')) not null, "source_url" varchar(255) null, "year" int4 null, "month" int4 null, "day" int4 null, "artist_id" int4 null);',
		);
		this.addSql(
			'create index "quotes_author_type_index" on "quotes" ("author_type");',
		);

		this.addSql(
			'alter table "quotes" add constraint "quotes_artist_id_foreign" foreign key ("artist_id") references "artists" ("id") on update cascade on delete set null;',
		);
	}
}
