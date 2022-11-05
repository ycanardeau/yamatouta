import { PermissionContext } from '@/services/PermissionContext';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetPermissionContext = createParamDecorator(
	(_, ctx: ExecutionContext) =>
		new PermissionContext(ctx.switchToHttp().getRequest()),
);
