import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Request } from 'express';

import {
	CreateUserCommand,
	CreateUserParams,
} from '../database/commands/users/CreateUserCommandHandler';
import { GetPermissionContext } from '../decorators/GetPermissionContext';
import { AuthenticatedUserObject } from '../dto/AuthenticatedUserObject';
import { LocalAuthGuard } from '../guards/LocalAuthGuard';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import { PermissionContext } from '../services/PermissionContext';
import { AuthService } from '../services/auth/AuthService';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly authService: AuthService,
	) {}

	@Post('register')
	createUser(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(CreateUserParams.schema))
		params: CreateUserParams,
	): Promise<AuthenticatedUserObject> {
		return this.commandBus.execute(
			new CreateUserCommand(permissionContext, params),
		);
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	login(
		@Req() request: Request,
	): Promise<AuthenticatedUserObject | undefined> {
		return this.authService.login(request);
	}

	@HttpCode(HttpStatus.OK)
	@Post('logout')
	logout(@Req() request: Request): void {
		return this.authService.logout(request);
	}
}
