import { EntityManager } from '@mikro-orm/core';

import { Artist } from '../src/entities/Artist';
import { Quote } from '../src/entities/Quote';
import { Translation } from '../src/entities/Translation';
import { User } from '../src/entities/User';
import { Work } from '../src/entities/Work';
import { ArtistType } from '../src/models/ArtistType';
import { QuoteType } from '../src/models/QuoteType';
import { UserGroup } from '../src/models/UserGroup';
import { WordCategory } from '../src/models/WordCategory';
import { WorkType } from '../src/models/WorkType';
import { NgramConverter } from '../src/services/NgramConverter';
import { PasswordHasherFactory } from '../src/services/passwordHashers/PasswordHasherFactory';
import { normalizeEmail } from '../src/utils/normalizeEmail';

const passwordHasherFactory = new PasswordHasherFactory();
const passwordHasher = passwordHasherFactory.default;

export const createUser = async (
	em: EntityManager,
	{
		username,
		email,
		password = 'P@$$w0rd',
		userGroup = UserGroup.User,
		deleted = false,
		hidden = false,
	}: {
		username: string;
		email: string;
		password?: string;
		userGroup?: UserGroup;
		deleted?: boolean;
		hidden?: boolean;
	},
): Promise<User> => {
	const normalizedEmail = await normalizeEmail(email);
	const salt = await passwordHasher.generateSalt();
	const passwordHash = await passwordHasher.hashPassword(password, salt);

	const user = new User({
		name: username,
		email: email,
		normalizedEmail: normalizedEmail,
		passwordHashAlgorithm: passwordHasher.algorithm,
		salt: salt,
		passwordHash: passwordHash,
	});
	user.userGroup = userGroup;
	user.deleted = deleted;
	user.hidden = hidden;

	em.persist(user);

	await em.flush();

	return user;
};

const ngramConverter = new NgramConverter();

export const createTranslation = async (
	em: EntityManager,
	{
		headword,
		locale,
		reading,
		yamatokotoba,
		category = WordCategory.Unspecified,
		user,
		deleted = false,
		hidden = false,
	}: {
		headword: string;
		locale: string;
		reading: string;
		yamatokotoba: string;
		category?: WordCategory;
		user: User;
		deleted?: boolean;
		hidden?: boolean;
	},
): Promise<Translation> => {
	const translation = new Translation({
		translatedString: {
			headword: headword,
			locale: locale,
			reading: reading,
			yamatokotoba: yamatokotoba,
		},
		category: category,
		user: user,
	});
	translation.deleted = deleted;
	translation.hidden = hidden;

	translation.updateSearchIndex(ngramConverter);

	em.persist(translation);

	await em.flush();

	return translation;
};

export const createQuote = async (
	em: EntityManager,
	{
		quoteType,
		text,
		locale,
		artist,
		deleted = false,
		hidden = false,
	}: {
		quoteType: QuoteType;
		text: string;
		locale: string;
		artist: Artist;
		deleted?: boolean;
		hidden?: boolean;
	},
): Promise<Quote> => {
	const quote = new Quote({
		quoteType: quoteType,
		text: text,
		locale: locale,
		artist: artist,
	});
	quote.deleted = deleted;
	quote.hidden = hidden;

	em.persist(quote);

	await em.flush();

	return quote;
};

export const createArtist = async (
	em: EntityManager,
	{
		name,
		artistType,
		deleted = false,
		hidden = false,
	}: {
		name: string;
		artistType: ArtistType;
		deleted?: boolean;
		hidden?: boolean;
	},
): Promise<Artist> => {
	const artist = new Artist({
		name: name,
		artistType: artistType,
	});
	artist.deleted = deleted;
	artist.hidden = hidden;

	em.persist(artist);

	await em.flush();

	return artist;
};

export const createWork = async (
	em: EntityManager,
	{
		name,
		workType,
		deleted = false,
		hidden = false,
	}: {
		name: string;
		workType: WorkType;
		deleted?: boolean;
		hidden?: boolean;
	},
): Promise<Work> => {
	const work = new Work({
		name: name,
		workType: workType,
	});
	work.deleted = deleted;
	work.hidden = hidden;

	em.persist(work);

	await em.flush();

	return work;
};
