import { Translation } from '@/data/database';
import {
	japaneseCaption,
	statusLabels,
	yamatokotobaCaption,
} from '@/shared/constants';
import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

const SortHeader = ({
	sortKey,
	caption,
	flag,
	sort,
}: {
	sortKey: string;
	caption: string;
	flag: string;
	sort?: string;
}): React.ReactElement => {
	const { pathname } = useLocation();
	const [searchParams] = useSearchParams();

	if (sort === undefined) {
		return (
			<>
				<img src={flag} alt="" /> <strong>{caption}</strong>
			</>
		);
	}

	const params = new URLSearchParams({ sort: sortKey });
	const pageSize = searchParams.get('pagesize');
	if (pageSize) params.set('pagesize', pageSize);

	return (
		<div className="dropup">
			<img src={flag} alt="" />{' '}
			<Link to={`${pathname}?${params}`} className="text-default">
				<strong>{caption}</strong>
				{sort === sortKey && (
					<>
						{' '}
						<span className="caret"></span>
					</>
				)}
			</Link>
		</div>
	);
};

// views/translations/table.php
const TranslationTable = ({
	translations,
	sort,
}: {
	translations: Translation[];
	// Shows sortable headers when set.
	sort?: string;
}): React.ReactElement => (
	<div className="result result-hover result-condensed">
		<div className="result-heading">
			<div className="result-row">
				<div className="row">
					<div className="col-sm-6">
						<SortHeader
							sortKey="ja"
							caption={japaneseCaption}
							flag="/images/flag_of_japan.png"
							sort={sort}
						/>
					</div>
					<div className="col-sm-6">
						<SortHeader
							sortKey="ojp"
							caption={yamatokotobaCaption}
							flag="/images/flag_of_yamato.png"
							sort={sort}
						/>
					</div>
				</div>
			</div>
		</div>
		<div className="result-body">
			{translations.map((translation) => (
				<div className="result-row" key={translation.id}>
					<div className="row">
						<div className="col-sm-6">
							<div className="clearfix">
								<Link
									to={`/translations/${translation.id}/view`}
									className="text-default"
									title={`No.${translation.id}を閲覧`}
								>
									<span className="glyphicon glyphicon-info-sign"></span>
								</Link>{' '}
								{statusLabels[translation.status] && (
									<>
										<span className="label label-danger">
											{statusLabels[translation.status]}
										</span>{' '}
									</>
								)}
								<Link
									to={`/ja-ojp/${encodeURIComponent(
										translation.japanese,
									)}`}
									className="text-default"
								>
									{translation.japanese}
								</Link>
								{translation.reading && (
									<small>【{translation.reading}】</small>
								)}{' '}
								{translation.category && (
									<small>{`{${translation.category}}`}</small>
								)}
							</div>
						</div>
						<div className="col-sm-6">
							<div className="clearfix">
								{translation.yamatokotoba
									.split(' ')
									.map((value, index) => (
										<React.Fragment key={index}>
											<Link
												to={`/ojp-ja/${encodeURIComponent(
													value,
												)}`}
												className="text-default"
											>
												{value}
											</Link>{' '}
										</React.Fragment>
									))}
								{translation.tags.length > 0 && (
									<div className="pull-right">
										{translation.tags.map((tag) => (
											<React.Fragment key={tag}>
												<Link
													to={`/translations/tagged/${encodeURIComponent(
														tag,
													)}`}
													className="label label-default"
												>
													{tag}
												</Link>{' '}
											</React.Fragment>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	</div>
);

export default TranslationTable;
