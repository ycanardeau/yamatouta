import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import requestIp from 'request-ip';

import { AuthenticatedUserObject } from '../dto/users/AuthenticatedUserObject';
import { LocalAuthGuard } from '../guards/LocalAuthGuard';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import {
	createUserBodySchema,
	ICreateUserBody,
} from '../requests/auth/ICreateUserBody';
import { LoginService } from '../services/auth/LoginService';
import { LogoutService } from '../services/auth/LogoutService';
import { CreateUserService } from '../services/users/CreateUserService';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly createUserService: CreateUserService,
		private readonly loginService: LoginService,
		private readonly logoutService: LogoutService,
	) {}

	@Post('register')
	createUser(
		@Body(new JoiValidationPipe(createUserBodySchema))
		body: ICreateUserBody,
		@Req() request: Request,
	): Promise<AuthenticatedUserObject> {
		const ip = requestIp.getClientIp(request);

		if (!ip) throw new BadRequestException('IP address cannot be found.');

		return this.createUserService.createUser({
			...body,
			ip: ip,
		});
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	login(@Req() request: Request): Promise<AuthenticatedUserObject> {
		return this.loginService.login(request);
	}

	@HttpCode(HttpStatus.OK)
	@Post('logout')
	logout(@Req() request: Request): void {
		return this.logoutService.logout(request);
	}
}
