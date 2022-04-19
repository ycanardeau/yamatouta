import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import requestIp from 'request-ip';

export const getClientIp = (request: Request): string => {
	const clientIp = requestIp.getClientIp(request);

	if (!clientIp) throw new BadRequestException('IP address cannot be found.');

	return clientIp;
};
