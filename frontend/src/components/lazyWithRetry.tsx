// Code from: https://gist.github.com/raphael-leger/4d703dea6c845788ff9eb36142374bdb#file-lazywithretry-js
import React from 'react';

const lazyWithRetry = <T extends React.ComponentType<any>>(
	factory: () => Promise<{ default: T }>,
): React.LazyExoticComponent<T> =>
	React.lazy(async (): Promise<{ default: T }> => {
		const pageHasAlreadyBeenForceRefreshed = JSON.parse(
			window.localStorage.getItem('page-has-been-force-refreshed') ||
				'false',
		);

		try {
			const component = await factory();

			window.localStorage.setItem(
				'page-has-been-force-refreshed',
				'false',
			);

			return component;
		} catch (error) {
			if (!pageHasAlreadyBeenForceRefreshed) {
				// Assuming that the user is not on the latest version of the application.
				// Let's refresh the page immediately.
				window.localStorage.setItem(
					'page-has-been-force-refreshed',
					'true',
				);

				window.location.reload();
			}

			// The page has already been reloaded
			// Assuming that user is already using the latest version of the application.
			// Let's let the application crash and raise the error.
			throw error;
		}
	});

export default lazyWithRetry;
