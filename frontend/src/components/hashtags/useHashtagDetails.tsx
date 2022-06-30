import React from 'react';
import { useParams } from 'react-router-dom';

import { hashtagApi } from '../../api/hashtagApi';
import { IHashtagObject } from '../../dto/IHashtagObject';

export const useHashtagDetails = <T,>(
	factory: (hashtag: IHashtagObject) => T,
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
