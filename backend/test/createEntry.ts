import { Artist } from '../src/entities/Artist';
import { ArtistQuote } from '../src/entities/ArtistQuote';
import { Translation } from '../src/entities/Translation';
import { User } from '../src/entities/User';
import { ArtistType } from '../src/models/ArtistType';
import { QuoteType } from '../src/models/QuoteType';
import { UserGroup } from '../src/models/UserGroup';
import { WordCategory } from '../src/models/WordCategory';
import { PasswordHasherFactory } from '../src/services/passwordHashers/PasswordHasherFactory';
import { NormalizeEmailService } from '../src/services/users/NormalizeEmailService';

const passwordHasherFactory = new PasswordHasherFactory();
const passwordHasher = passwordHasherFactory.default;

const normalizeEmailService = new NormalizeEmailService();

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
	const normalizedEmail = await normalizeEmailService.normalizeEmail(email);
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
	category,
	user,
	deleted = false,
	hidden = false,
}: {
	id: number;
	headword: string;
	locale?: string;
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

export const createArtistQuote = ({
	id,
	quoteType,
	text,
	artist,
	deleted = false,
	hidden = false,
}: {
	id: number;
	quoteType: QuoteType;
	text: string;
	artist: Artist;
	deleted?: boolean;
	hidden?: boolean;
}): ArtistQuote => {
	const artistQuote = new ArtistQuote({
		quoteType: quoteType,
		text: text,
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
