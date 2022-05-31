import { BadRequestException } from '@nestjs/common';

export class UserEmailAlreadyExistsException extends BadRequestException {
	constructor() {
		super('Email is already taken.');
	}
}
