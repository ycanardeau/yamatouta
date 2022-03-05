import { EuiAvatar, EuiAvatarProps } from '@elastic/eui';
import React from 'react';

const Avatar = (props: EuiAvatarProps): React.ReactElement => {
	return <EuiAvatar {...props} />;
};

export default Avatar;
