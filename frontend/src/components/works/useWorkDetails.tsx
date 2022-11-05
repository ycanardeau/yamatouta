import { workApi } from '@/api/workApi';
import { IWorkDto } from '@/dto/IWorkDto';
import { WorkOptionalField } from '@/models/works/WorkOptionalField';
import React from 'react';
import { useParams } from 'react-router-dom';

export const useWorkDetails = <T,>(
	factory: (work: IWorkDto) => T,
): [T | undefined] => {
	const { id } = useParams();

	const [work, setWork] = React.useState<T>();

	React.useEffect(() => {
		workApi
			.get({
				id: Number(id),
				fields: Object.values(WorkOptionalField),
			})
			.then((work) => setWork(factory(work)));
	}, [id, factory]);

	return [work];
};
