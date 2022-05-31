import { EuiAvatar, EuiAvatarProps } from '@elastic/eui';
import React from 'react';

export const Avatar = (props: EuiAvatarProps): React.ReactElement => {
	return <EuiAvatar {...props} />;
};
