export class UserAuthenticateParams {
	constructor(
		readonly email: string,
		readonly password: string,
		readonly clientIp: string,
	) {}
}
