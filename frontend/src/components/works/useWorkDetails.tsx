import React from 'react';
import { useParams } from 'react-router-dom';

import { workApi } from '../../api/workApi';
import { IWorkObject } from '../../dto/IWorkObject';
import { WorkOptionalField } from '../../models/WorkOptionalField';

export const useWorkDetails = <T,>(
	factory: (work: IWorkObject) => T,
): [T | undefined] => {
	const { id } = useParams();

	const [work, setWork] = React.useState<T>();

	React.useEffect(() => {
		workApi
			.get({
				id: Number(id),
				fields: [WorkOptionalField.WebLinks],
			})
			.then((work) => setWork(factory(work)));
	}, [id, factory]);

	return [work];
};
