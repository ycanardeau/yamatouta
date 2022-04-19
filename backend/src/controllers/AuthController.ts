import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import {
	CreateUserCommand,
	CreateUserCommandHandler,
} from '../database/commands/users/CreateUserCommandHandler';
import { AuthenticatedUserObject } from '../dto/users/AuthenticatedUserObject';
import { LocalAuthGuard } from '../guards/LocalAuthGuard';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import { AuthService } from '../services/auth/AuthService';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly createUserCommandHandler: CreateUserCommandHandler,
		private readonly authService: AuthService,
	) {}

	@Post('register')
	createUser(
		@Body(new JoiValidationPipe(CreateUserCommand.schema))
		command: CreateUserCommand,
	): Promise<AuthenticatedUserObject> {
		return this.createUserCommandHandler.execute(command);
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
