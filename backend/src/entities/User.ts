import {
	Entity,
	Enum,
	IdentifiedReference,
	Index,
	OneToOne,
	PrimaryKey,
	Property,
	Reference,
} from '@mikro-orm/core';

import { EntryType } from '../models/EntryType';
import { IEntryWithSearchIndex } from '../models/IEntryWithSearchIndex';
import { PasswordHashAlgorithm } from '../models/PasswordHashAlgorithm';
import { Permission } from '../models/Permission';
import { userGroupPermissions } from '../models/userGroupPermissions';
import { UserGroup } from '../models/users/UserGroup';
import { NgramConverter } from '../services/NgramConverter';
import { IPasswordHasher } from '../services/passwordHashers/IPasswordHasher';

@Entity({ tableName: 'users' })
export class User implements IEntryWithSearchIndex<UserSearchIndex> {
	@PrimaryKey()
	id!: number;

	@Property()
	createdAt = new Date();

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();

	@Property()
	deleted = false;

	@Property()
	hidden = false;

	@Property()
	name: string;

	@Property()
	email: string;

	@Property()
	normalizedEmail: string;

	@Property()
	emailConfirmed = false;

	@Enum()
	passwordHashAlgorithm: PasswordHashAlgorithm;

	@Property()
	salt: string;

	@Property()
	passwordHash: string;

	@Property()
	securityStamp?: string;

	@Property()
	concurrencyStamp?: string;

	@Property()
	phoneNumber?: string;

	@Property()
	phoneNumberConfirmed = false;

	@Property()
	twoFactorEnabled = false;

	@Property()
	lockoutEnd?: Date;

	@Property()
	lockoutEnabled = false;

	@Property()
	accessFailedCount = 0;

	@Enum()
	userGroup = UserGroup.User;

	@OneToOne(() => UserSearchIndex, (searchIndex) => searchIndex.user)
	searchIndex: IdentifiedReference<UserSearchIndex>;

	constructor({
		name,
		email,
		normalizedEmail,
		passwordHashAlgorithm,
		salt,
		passwordHash,
	}: {
		name: string;
		email: string;
		normalizedEmail: string;
		passwordHashAlgorithm: PasswordHashAlgorithm;
		salt: string;
		passwordHash: string;
	}) {
		this.name = name;
		this.email = email;
		this.normalizedEmail = normalizedEmail;
		this.passwordHashAlgorithm = passwordHashAlgorithm;
		this.salt = salt;
		this.passwordHash = passwordHash;
		this.searchIndex = Reference.create(new UserSearchIndex(this));
	}

	get entryType(): EntryType.User {
		return EntryType.User;
	}

	get effectivePermissions(): Permission[] {
		return [
			...userGroupPermissions[this.userGroup],
			// TODO: Implement additional permissions.
		];
	}

	async updatePassword(
		passwordHasher: IPasswordHasher,
		password: string,
	): Promise<void> {
		if (this.passwordHashAlgorithm !== passwordHasher.algorithm) {
			// TODO: Log.

			this.passwordHashAlgorithm = passwordHasher.algorithm;
			this.salt = await passwordHasher.generateSalt();
		}

		this.passwordHash = await passwordHasher.hashPassword(
			password,
			this.salt,
		);
	}

	updateSearchIndex(ngramConverter: NgramConverter): void {
		const searchIndex = this.searchIndex.getEntity();
		searchIndex.name = ngramConverter.toFullText(this.name, 2);
	}
}

@Entity({ tableName: 'user_search_index' })
@Index({ properties: ['name'], type: 'fulltext' })
export class UserSearchIndex {
	@PrimaryKey()
	id!: number;

	@OneToOne()
	user: User;

	@Property({ columnType: 'text', lazy: true })
	name = '';

	constructor(user: User) {
		this.user = user;
	}

	get entry(): IEntryWithSearchIndex<UserSearchIndex> {
		return this.user;
	}
}
