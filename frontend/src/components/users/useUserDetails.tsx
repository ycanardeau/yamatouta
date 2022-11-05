import { userApi } from '@/api/userApi';
import { IUserDto } from '@/dto/IUserDto';
import React from 'react';
import { useParams } from 'react-router-dom';

export const useUserDetails = <T,>(
	factory: (user: IUserDto) => T,
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
