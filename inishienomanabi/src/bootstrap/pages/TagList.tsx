import { SortLink, taggedUrl } from '@/bootstrap/parts';
import { listTags } from '@/data/database';
import { useAsync, useNoIndex, useTitle } from '@/shared/hooks';
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

// views/tags/list.php
const TagList = (): React.ReactElement => {
	const [searchParams] = useSearchParams();
	const sort = searchParams.get('sort') === 'name' ? 'name' : 'popular';

	useNoIndex();
	useTitle('タグ');

	const tags = useAsync(() => listTags(sort), [sort]);

	return (
		<div className="row">
			<div className="col-sm-9">
				<h2>タグ</h2>
				{tags &&
					(tags.length > 0 ? (
						<div className="result result-hover result-condensed">
							<div className="result-heading">
								<div className="result-row">
									<div className="row">
										<div className="col-xs-10">
											<SortLink
												sortKey="name"
												sort={sort}
											>
												名前
											</SortLink>
										</div>
										<div className="col-xs-2">
											<SortLink
												sortKey="popular"
												sort={sort}
											>
												数
											</SortLink>
										</div>
									</div>
								</div>
							</div>
							<div className="result-body">
								{tags.map((tag) => (
									<div className="result-row" key={tag.name}>
										<div className="row">
											<div className="col-xs-10">
												<Link to={taggedUrl(tag.name)}>
													{tag.name}
												</Link>
											</div>
											<div className="col-xs-2">
												{tag.count}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					) : (
						<p>タグはありません。</p>
					))}
			</div>
			<div className="col-sm-3"></div>
		</div>
	);
};

export default TagList;
