// Code from: https://github.com/OdyseeTeam/odysee-frontend/blob/247ee757d1b8df8cfe0e7b034287ec6de8d22003/ui/util/lazyImport.js.
import React from 'react';

const retryDelayMilliseconds = 2000;
const retryAttempts = 2;

const componentLoader = <T extends React.ComponentType<any>>(
	lazyComponent: () => Promise<{ default: T }>,
	attemptsLeft: number,
): Promise<{ default: T }> => {
	return new Promise((resolve, reject) => {
		lazyComponent()
			.then(resolve)
			.catch((error) => {
				setTimeout(() => {
					if (attemptsLeft === 1) {
						console.error(error.message);
					} else {
						componentLoader(lazyComponent, attemptsLeft - 1).then(
							resolve,
							reject,
						);
					}
				}, retryDelayMilliseconds);
			});
	});
};

const lazyImport = <T extends React.ComponentType<any>>(
	componentImport: () => Promise<{ default: T }>,
): React.LazyExoticComponent<T> => {
	return React.lazy(() => componentLoader(componentImport, retryAttempts));
};

export default lazyImport;
