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

import { UserObject } from '../dto/users/UserObject';
import { LocalAuthGuard } from '../guards/LocalAuthGuard';
import { CreateUserBody } from '../requests/auth/CreateUserBody';
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
		@Body() body: CreateUserBody,
		@Req() request: Request,
	): Promise<UserObject> {
		const { username, email, password } = body;

		const ip = requestIp.getClientIp(request);

		if (!ip) throw new BadRequestException('IP address cannot be found.');

		return this.createUserService.createUser({
			username: username,
			email: email,
			password: password,
			ip: ip,
		});
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	login(@Req() request: Request): Promise<UserObject> {
		return this.loginService.login(request);
	}

	@HttpCode(HttpStatus.OK)
	@Post('logout')
	logout(@Req() request: Request): void {
		return this.logoutService.logout(request);
	}
}
