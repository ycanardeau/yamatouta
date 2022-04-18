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
import { PasswordHasherFactory } from '../src/services/passwordHashers/PasswordHasherFactory';
import { normalizeEmail } from '../src/utils/normalizeEmail';

const passwordHasherFactory = new PasswordHasherFactory();
const passwordHasher = passwordHasherFactory.default;

export const createUser = async ({
	id,
	username,
	email,
	password = 'P@$$w0rd',
	userGroup = UserGroup.User,
	deleted = false,
	hidden = false,
}: {
	id: number;
	username: string;
	email: string;
	password?: string;
	userGroup?: UserGroup;
	deleted?: boolean;
	hidden?: boolean;
}): Promise<User> => {
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
	user.id = id;
	user.userGroup = userGroup;
	user.deleted = deleted;
	user.hidden = hidden;

	return user;
};

export const createTranslation = ({
	id,
	headword,
	locale,
	reading,
	yamatokotoba,
	category = WordCategory.Unspecified,
	user,
	deleted = false,
	hidden = false,
}: {
	id: number;
	headword: string;
	locale: string;
	reading: string;
	yamatokotoba: string;
	category?: WordCategory;
	user: User;
	deleted?: boolean;
	hidden?: boolean;
}): Translation => {
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
	translation.id = id;
	translation.deleted = deleted;
	translation.hidden = hidden;

	return translation;
};

export const createQuote = ({
	id,
	quoteType,
	text,
	locale,
	artist,
	deleted = false,
	hidden = false,
}: {
	id: number;
	quoteType: QuoteType;
	text: string;
	locale: string;
	artist: Artist;
	deleted?: boolean;
	hidden?: boolean;
}): Quote => {
	const artistQuote = new Quote({
		quoteType: quoteType,
		text: text,
		locale: locale,
		artist: artist,
	});
	artistQuote.id = id;
	artistQuote.deleted = deleted;
	artistQuote.hidden = hidden;

	return artistQuote;
};

export const createArtist = ({
	id,
	name,
	artistType,
	deleted = false,
	hidden = false,
}: {
	id: number;
	name: string;
	artistType: ArtistType;
	deleted?: boolean;
	hidden?: boolean;
}): Artist => {
	const artist = new Artist({
		name: name,
		artistType: artistType,
	});
	artist.id = id;
	artist.deleted = deleted;
	artist.hidden = hidden;

	return artist;
};

export const createWork = ({
	id,
	name,
	workType,
	deleted = false,
	hidden = false,
}: {
	id: number;
	name: string;
	workType: WorkType;
	deleted?: boolean;
	hidden?: boolean;
}): Work => {
	const work = new Work({
		name: name,
		workType: workType,
	});
	work.id = id;
	work.deleted = deleted;
	work.hidden = hidden;

	return work;
};
