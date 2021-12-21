import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class User {
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

	@Property()
	passwordHashAlgorithm: string;

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

	constructor(params: {
		name: string;
		email: string;
		normalizedEmail: string;
		passwordHashAlgorithm: string;
		salt: string;
		passwordHash: string;
	}) {
		const {
			name,
			email,
			normalizedEmail,
			passwordHashAlgorithm,
			salt,
			passwordHash,
		} = params;

		this.name = name;
		this.email = email;
		this.normalizedEmail = normalizedEmail;
		this.passwordHashAlgorithm = passwordHashAlgorithm;
		this.salt = salt;
		this.passwordHash = passwordHash;
	}
}
