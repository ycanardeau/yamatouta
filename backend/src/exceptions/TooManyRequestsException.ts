import { HttpException, HttpStatus } from '@nestjs/common';

// TODO: Replace this with nestjs/throttler's ThrottlerException.
export class TooManyRequestsException extends HttpException {
	constructor(message?: string) {
		super(message || 'Too many requests.', HttpStatus.TOO_MANY_REQUESTS);
	}
}
