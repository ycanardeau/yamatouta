import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

// views/pagination.php
const Pagination = ({
	page,
	pageSize,
	totalCount,
}: {
	page: number;
	pageSize: number;
	totalCount: number;
}): React.ReactElement => {
	const { pathname } = useLocation();
	const [searchParams] = useSearchParams();

	const totalPages = Math.ceil(totalCount / pageSize);
	const totalLinks = Math.min(13, totalPages);
	let lowerBound = page - Math.floor(totalLinks / 2);
	let upperBound = page + Math.floor(totalLinks / 2);
	if (lowerBound < 1) {
		lowerBound = 1;
		upperBound = totalLinks;
	}
	if (upperBound > totalPages) {
		lowerBound = totalPages - totalLinks + 1;
		upperBound = totalPages;
	}

	const to = (p: number): string => {
		const params = new URLSearchParams(searchParams);
		params.set('page', String(p));
		return `${pathname}?${params}`;
	};

	const pages: number[] = [];
	for (
		let i = Math.max(1, lowerBound);
		i <= Math.min(upperBound, totalPages);
		i++
	)
		pages.push(i);

	return (
		<ul className="pagination pagination-sm">
			{page > 1 ? (
				<>
					<li>
						<Link to={to(1)}>&laquo;</Link>
					</li>
					<li>
						<Link to={to(page - 1)}>&lsaquo;</Link>
					</li>
				</>
			) : (
				<>
					<li className="disabled">
						<span>&laquo;</span>
					</li>
					<li className="disabled">
						<span>&lsaquo;</span>
					</li>
				</>
			)}
			{pages.map((i) =>
				i === page ? (
					<li key={i} className="active">
						<span>
							{i} <span className="sr-only">(current)</span>
						</span>
					</li>
				) : (
					<li key={i}>
						<Link to={to(i)}>{i}</Link>
					</li>
				),
			)}
			{page < totalPages ? (
				<>
					<li>
						<Link to={to(page + 1)}>&rsaquo;</Link>
					</li>
					<li>
						<Link to={to(totalPages)}>&raquo;</Link>
					</li>
				</>
			) : (
				<>
					<li className="disabled">
						<span>&rsaquo;</span>
					</li>
					<li className="disabled">
						<span>&raquo;</span>
					</li>
				</>
			)}
		</ul>
	);
};

export default Pagination;
