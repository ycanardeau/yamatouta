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

import { AuthenticatedUserObject } from '../dto/users/AuthenticatedUserObject';
import { LocalAuthGuard } from '../guards/LocalAuthGuard';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import { LoginService } from '../services/auth/LoginService';
import { LogoutService } from '../services/auth/LogoutService';
import {
	CreateUserCommand,
	CreateUserCommandHandler,
} from '../services/commands/users/CreateUserCommandHandler';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly createUserCommandHandler: CreateUserCommandHandler,
		private readonly loginService: LoginService,
		private readonly logoutService: LogoutService,
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
	login(@Req() request: Request): Promise<AuthenticatedUserObject> {
		return this.loginService.execute(request);
	}

	@HttpCode(HttpStatus.OK)
	@Post('logout')
	logout(@Req() request: Request): void {
		return this.logoutService.execute(request);
	}
}
