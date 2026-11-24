import TranslationTable from '@/bootstrap/TranslationTable';
import {
	Translation,
	listPopularTranslations,
	listTranslations,
} from '@/data/database';
import { useAsync, useTitle } from '@/shared/hooks';
import React from 'react';

const TopTranslations = ({
	title,
	load,
}: {
	title: string;
	load: () => Promise<Translation[]>;
}): React.ReactElement => {
	useTitle(title);

	const translations = useAsync(load, [title]);

	return (
		<div className="row">
			<div className="col-sm-9">
				<h2>{title}</h2>
				{translations &&
					(translations.length > 0 ? (
						<TranslationTable translations={translations} />
					) : (
						<p>{title}はありません。</p>
					))}
			</div>
			<div className="col-sm-3"></div>
		</div>
	);
};

// views/translations/newest.php
export const NewestTranslations = (): React.ReactElement => (
	<TopTranslations
		title="新しく登録された翻訳"
		load={async () => (await listTranslations('id', 1, 50)).items}
	/>
);

// views/translations/popular.php
export const PopularTranslations = (): React.ReactElement => (
	<TopTranslations
		title="人気の翻訳"
		load={async () => (await listPopularTranslations(1, 50)).items}
	/>
);
