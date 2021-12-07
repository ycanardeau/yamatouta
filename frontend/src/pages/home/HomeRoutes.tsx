import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const HomeRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route
				path=""
				element={
					<Navigate
						to="/quotes"
						replace
					/> /* TODO: Create HomeIndex. */
				}
			/>
		</Routes>
	);
};

export default HomeRoutes;
