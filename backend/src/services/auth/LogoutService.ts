import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LogoutService {
	logout(request: Request): void {
		request.logOut();
		request.session.cookie.maxAge = 0;
	}
}
