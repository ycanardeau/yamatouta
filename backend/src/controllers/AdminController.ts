import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

import { renderReact } from './renderReact';

@Controller('admin')
export class AdminController {
	@Get('')
	index(@Res() response: Response): void {
		return renderReact(response);
	}
}
