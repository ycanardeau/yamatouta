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

import { CreateUserCommand } from '../database/commands/users/CreateUserCommandHandler';
import { AuthenticatedUserObject } from '../dto/users/AuthenticatedUserObject';
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
		@Req() request: Request,
		@Body(new JoiValidationPipe(CreateUserCommand.schema))
		command: CreateUserCommand,
	): Promise<AuthenticatedUserObject> {
		return this.commandBus.execute(
			new CreateUserCommand(
				new PermissionContext(request),
				command.username,
				command.email,
				command.password,
			),
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
