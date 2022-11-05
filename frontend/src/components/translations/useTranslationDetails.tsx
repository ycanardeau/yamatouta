import { translationApi } from '@/api/translationApi';
import { ITranslationObject } from '@/dto/ITranslationObject';
import { TranslationOptionalField } from '@/models/translations/TranslationOptionalField';
import React from 'react';
import { useParams } from 'react-router-dom';

export const useTranslationDetails = <T,>(
	factory: (translation: ITranslationObject) => T,
): [T | undefined] => {
	const { id } = useParams();

	const [translation, setTranslation] = React.useState<T>();

	React.useEffect(() => {
		translationApi
			.get({
				id: Number(id),
				fields: Object.values(TranslationOptionalField),
			})
			.then((translation) => setTranslation(factory(translation)));
	}, [id, factory]);

	return [translation];
};
