import { userApi } from '@/api/userApi';
import { IUserObject } from '@/dto/IUserObject';
import React from 'react';
import { useParams } from 'react-router-dom';

export const useUserDetails = <T,>(
	factory: (user: IUserObject) => T,
): [T | undefined] => {
	const { id } = useParams();

	const [user, setUser] = React.useState<T>();

	React.useEffect(() => {
		userApi
			.get({
				id: Number(id),
			})
			.then((user) => setUser(factory(user)));
	}, [id, factory]);

	return [user];
};
