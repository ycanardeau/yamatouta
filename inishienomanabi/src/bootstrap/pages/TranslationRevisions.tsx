import NotFound from '@/bootstrap/pages/NotFound';
import {
	EntryColumns,
	EntryHeading,
	ProfileImage,
	SideNav,
	formatDate,
	profileUrl,
} from '@/bootstrap/parts';
import { getTranslation, listRevisions } from '@/data/database';
import { useAsync, useNoIndex, useTitle } from '@/shared/hooks';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

// views/translations/revisions.php
const TranslationRevisions = (): React.ReactElement | null => {
	const id = Number(useParams().id);

	useNoIndex();
	useTitle(`No.${id}の改訂履歴`);

	const data = useAsync(async () => {
		const translation = await getTranslation(id);
		return translation
			? { translation, revisions: await listRevisions(id) }
			: null;
	}, [id]);

	if (data === undefined) return null;
	if (data === null) return <NotFound />;

	const { translation, revisions } = data;

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
					<h2>No.{id}の改訂履歴</h2>
					{revisions.length > 0 ? (
						<div className="result result-hover result-condensed">
							<div className="result-heading">
								<div className="result-row">
									<div className="row">
										<div className="col-sm-2">
											<strong>日付</strong>
										</div>
										<div className="col-sm-8">
											<EntryHeading />
										</div>
										<div className="col-sm-2">
											<strong>投稿者</strong>
										</div>
									</div>
								</div>
							</div>
							<div className="result-body">
								{revisions.map((revision) => (
									<div
										className="result-row"
										key={revision.id}
									>
										<div className="row">
											<div className="col-sm-2">
												{formatDate(
													revision.creationDate,
												)}
											</div>
											<div className="col-sm-8">
												<EntryColumns
													entry={revision}
													plain
												/>
											</div>
											<div className="col-sm-2">
												{revision.user ? (
													<>
														<Link
															to={profileUrl(
																revision.user,
															)}
														>
															<ProfileImage
																user={
																	revision.user
																}
																size={23}
															/>
														</Link>{' '}
														<Link
															to={profileUrl(
																revision.user,
															)}
														>
															{revision.user.name}
														</Link>
													</>
												) : (
													<>&nbsp;</>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					) : (
						<p>履歴はありません。</p>
					)}
				</div>
				<div className="col-sm-3">
					<h2>No.{id}</h2>
					<SideNav
						navs={[
							['閲覧', `/translations/${id}/view`],
							['履歴表示', `/translations/${id}/revisions`],
						]}
						active="履歴表示"
					/>
				</div>
			</div>
		</>
	);
};

export default TranslationRevisions;
