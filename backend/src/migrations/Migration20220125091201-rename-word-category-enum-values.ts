import { Migration } from '@mikro-orm/migrations';

export class Migration20220125091201 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			"ALTER TABLE `translations` CHANGE `category` `category` ENUM('noun','verb','adjective','adjectival-noun','adverb','postpositional-particle','auxiliary-verb','attributive','conjunction','prefix','suffix','interjection','other','pronoun') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL;",
		);
	}
}
