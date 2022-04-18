import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LogoutService {
	execute(request: Request): void {
		request.logOut();
		request.session.cookie.maxAge = 0;
	}
}
