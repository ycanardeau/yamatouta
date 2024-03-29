import { AuthenticatedUserDto } from '@/dto/AuthenticatedUserDto';
import { LocalAuthGuard } from '@/framework/guards/LocalAuthGuard';
import { AuthService } from '@/services/auth/AuthService';
import {
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Request } from 'express';

@Controller('api/auth')
export class AuthApiController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly authService: AuthService,
	) {}

	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	login(@Req() request: Request): Promise<AuthenticatedUserDto | undefined> {
		return this.authService.login(request);
	}

	@HttpCode(HttpStatus.OK)
	@Post('logout')
	logout(@Req() request: Request): void {
		return this.authService.logout(request);
	}
}
