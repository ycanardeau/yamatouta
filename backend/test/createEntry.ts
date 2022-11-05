import { Artist } from '@/entities/Artist';
import { Quote } from '@/entities/Quote';
import { Translation } from '@/entities/Translation';
import { User } from '@/entities/User';
import { Work } from '@/entities/Work';
import { ArtistType } from '@/models/artists/ArtistType';
import { QuoteType } from '@/models/quotes/QuoteType';
import { WordCategory } from '@/models/translations/WordCategory';
import { UserGroup } from '@/models/users/UserGroup';
import { WorkType } from '@/models/works/WorkType';
import { NgramConverter } from '@/services/NgramConverter';
import { PasswordHasherFactory } from '@/services/passwordHashers/PasswordHasherFactory';
import { normalizeEmail } from '@/utils/normalizeEmail';
import { EntityManager, Reference } from '@mikro-orm/core';

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
		actor,
		deleted = false,
		hidden = false,
	}: {
		headword: string;
		locale: string;
		reading: string;
		yamatokotoba: string;
		category?: WordCategory;
		actor: User;
		deleted?: boolean;
		hidden?: boolean;
	},
): Promise<Translation> => {
	const translation = new Translation(actor);
	translation.headword = headword;
	translation.locale = locale;
	translation.reading = reading;
	translation.yamatokotoba = yamatokotoba;
	translation.category = category;
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
		actor,
		deleted = false,
		hidden = false,
	}: {
		quoteType: QuoteType;
		text: string;
		locale: string;
		actor: User;
		artist: Artist;
		deleted?: boolean;
		hidden?: boolean;
	},
): Promise<Quote> => {
	const quote = new Quote(actor);
	quote.quoteType = quoteType;
	quote.text = text;
	quote.plainText = text; /* TODO: Remove markdown formatting. */
	quote.locale = locale;
	quote.artist = Reference.create(artist);
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
		actor,
		deleted = false,
		hidden = false,
	}: {
		name: string;
		artistType: ArtistType;
		actor: User;
		deleted?: boolean;
		hidden?: boolean;
	},
): Promise<Artist> => {
	const artist = new Artist(actor);
	artist.name = name;
	artist.artistType = artistType;
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
		actor,
		deleted = false,
		hidden = false,
	}: {
		name: string;
		workType: WorkType;
		actor: User;
		deleted?: boolean;
		hidden?: boolean;
	},
): Promise<Work> => {
	const work = new Work(actor);
	work.name = name;
	work.workType = workType;
	work.deleted = deleted;
	work.hidden = hidden;

	em.persist(work);

	await em.flush();

	return work;
};
