import { hashtagApi } from '@/api/hashtagApi';
import { IHashtagDto } from '@/dto/IHashtagDto';
import React from 'react';
import { useParams } from 'react-router-dom';

export const useHashtagDetails = <T,>(
	factory: (hashtag: IHashtagDto) => T,
): [T | undefined] => {
	const { name } = useParams();

	if (name === undefined) throw new Error('name is undefined');

	const [hashtag, setHashtag] = React.useState<T>();

	React.useEffect(() => {
		hashtagApi
			.get({ name: name })
			.then((hashtag) => setHashtag(factory(hashtag)));
	}, [name, factory]);

	return [hashtag];
};
