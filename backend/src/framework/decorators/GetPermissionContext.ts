import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { PermissionContext } from '../../services/PermissionContext';

export const GetPermissionContext = createParamDecorator(
	(_, ctx: ExecutionContext) =>
		new PermissionContext(ctx.switchToHttp().getRequest()),
);
