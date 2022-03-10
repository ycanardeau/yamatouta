import { Migration } from '@mikro-orm/migrations';

export class Migration20220311001531 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			"alter table `users` modify `password_hash_algorithm` enum('Bcrypt', 'Inishienomanabi') not null, modify `user_group` enum('LimitedUser', 'User', 'AdvancedUser', 'Mod', 'SeniorMod', 'Admin') not null;",
		);

		this.addSql(
			"alter table `translations` modify `category` enum('Noun', 'Verb', 'Adjective', 'AdjectivalNoun', 'Adverb', 'PostpositionalParticle', 'AuxiliaryVerb', 'Attributive', 'Conjunction', 'Prefix', 'Suffix', 'Interjection', 'Other', 'Pronoun');",
		);

		this.addSql(
			"alter table `audit_log_entries` modify `action` enum('User_Create', 'User_FailedLogin', 'User_Login', 'Translation_Create', 'User_Rename', 'User_ChangeEmail', 'User_ChangePassword') not null, modify `entry_type` enum('User', 'Translation', 'Quote', 'Artist', 'Work') not null;",
		);

		this.addSql(
			"alter table `artists` modify `artist_type` enum('Person', 'Group', 'Other', 'Character') not null;",
		);

		this.addSql(
			"alter table `quotes` modify `quote_type` enum('Word', 'Haiku', 'Tanka', 'Lyrics', 'Other') not null, modify `author_type` enum('Artist', 'User') not null;",
		);
	}

	async down(): Promise<void> {
		this.addSql(
			"alter table `users` modify `password_hash_algorithm` enum('bcrypt', 'inishienomanabi') not null, modify `user_group` enum('limited_user', 'user', 'advanced_user', 'mod', 'senior_mod', 'admin') not null;",
		);

		this.addSql(
			"alter table `translations` modify `category` enum('noun', 'verb', 'adjective', 'adjectival-noun', 'adverb', 'postpositional-particle', 'auxiliary-verb', 'attributive', 'conjunction', 'prefix', 'suffix', 'interjection', 'other', 'pronoun');",
		);

		this.addSql(
			"alter table `audit_log_entries` modify `action` enum('user.create', 'user.failed_login', 'user.login', 'translation.create', 'user.rename', 'user.change_email', 'user.change_password') not null, modify `entry_type` enum('user', 'translation', 'quote', 'artist', 'work') not null;",
		);

		this.addSql(
			"alter table `artists` modify `artist_type` enum('person', 'group', 'other', 'character') not null;",
		);

		this.addSql(
			"alter table `quotes` modify `quote_type` enum('word', 'haiku', 'tanka', 'lyrics', 'other') not null, modify `author_type` enum('artist', 'user') not null;",
		);
	}
}
