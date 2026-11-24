import Pagination from '@/bootstrap/Pagination';
import {
	PageCount,
	ProfileImage,
	UserBadge,
	profileUrl,
} from '@/bootstrap/parts';
import { listUsers } from '@/data/database';
import { useAsync, usePagination, useTitle } from '@/shared/hooks';
import React from 'react';
import { Link } from 'react-router-dom';

// The page size of the users page was fixed.
const pageSize = 20;

// views/users/list.php
const UserList = (): React.ReactElement => {
	const { page } = usePagination();

	useTitle('ユーザー');

	const result = useAsync(() => listUsers(page, pageSize), [page]);

	return (
		<div className="row">
			<div className="col-sm-9">
				<h2>
					ユーザー{' '}
					<PageCount totalCount={result?.totalCount} page={page} />
				</h2>
				{result && (
					<>
						<div className="result result-hover result-condensed">
							<div className="result-body">
								{result.items.map((user) => (
									<div className="result-row" key={user.id}>
										<div className="row">
											<div className="col-sm-12">
												<ProfileImage
													user={user}
													size={32}
												/>{' '}
												<Link to={profileUrl(user)}>
													{user.name}
												</Link>{' '}
												<UserBadge user={user} />
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
						<div className="text-center">
							<Pagination
								page={page}
								pageSize={pageSize}
								totalCount={result.totalCount}
							/>
						</div>
					</>
				)}
			</div>
			<div className="col-sm-3"></div>
		</div>
	);
};

export default UserList;
