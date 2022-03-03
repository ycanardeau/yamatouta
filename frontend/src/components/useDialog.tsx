import React from 'react';

export const useDialog = (): {
	visible: boolean;
	show: () => void;
	close: () => void;
} => {
	const [visible, setVisible] = React.useState(false);
	const show = (): void => setVisible(true);
	const close = (): void => setVisible(false);

	return { visible, show, close };
};
