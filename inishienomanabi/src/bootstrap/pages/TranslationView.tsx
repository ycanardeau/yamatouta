import TranslationTable from '@/bootstrap/TranslationTable';
import NotFound from '@/bootstrap/pages/NotFound';
import { getTranslation } from '@/data/database';
import { useAsync, useTitle } from '@/shared/hooks';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

const truncate = (text: string, width: number): string =>
	text.length > width ? `${text.slice(0, width - 2)} …` : text;

// views/translations/view.php, without comments and voting.
const TranslationView = (): React.ReactElement | null => {
	const id = Number(useParams().id);

	useTitle(`No.${id}を閲覧`);

	const translation = useAsync(
		async () => (await getTranslation(id)) ?? null,
		[id],
	);

	if (translation === undefined) return null;
	if (translation === null) return <NotFound />;

	return (
		<>
			<div className="row">
				<div className="col-sm-12">
					<ol className="breadcrumb">
						<li>
							<Link to="/translations">翻訳</Link>
						</li>
						<li>
							<Link to={`/translations/${id}/view`}>
								{translation.japanese} &harr;{' '}
								{translation.yamatokotoba}
							</Link>
						</li>
					</ol>
				</div>
			</div>
			<div className="row">
				<div className="col-sm-9">
					<h2>No.{id}を閲覧</h2>
					<TranslationTable translations={[translation]} />
					<div className="clearfix">
						<div className="pull-right">
							<button
								className="btn btn-primary btn-sm vote"
								disabled
							>
								<span className="glyphicon glyphicon-thumbs-up"></span>{' '}
								{translation.upvotes} 高く評価
							</button>{' '}
							<button
								className="btn btn-danger btn-sm vote"
								disabled
							>
								<span className="glyphicon glyphicon-thumbs-down"></span>{' '}
								{translation.downvotes} 低く評価
							</button>
						</div>
					</div>
					{translation.source && (
						<>
							<h2>出典</h2>
							{/^https?:\/\//.test(translation.source) ? (
								<p>
									<a
										href={translation.source}
										target="_blank"
										rel="noreferrer"
									>
										{truncate(translation.source, 40)}
									</a>
								</p>
							) : (
								translation.source
							)}
							{translation.description && (
								<blockquote>
									{translation.description}
								</blockquote>
							)}
						</>
					)}
				</div>
				<div className="col-sm-3">
					<h2>No.{id}</h2>
					<ul className="nav nav-pills nav-stacked">
						<li className="active">
							<Link to={`/translations/${id}/view`}>閲覧</Link>
						</li>
						<li>
							<Link to={`/translations/${id}/revisions`}>
								履歴表示
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</>
	);
};

export default TranslationView;
