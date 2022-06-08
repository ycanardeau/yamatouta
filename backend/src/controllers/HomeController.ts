import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

import { renderReact } from './renderReact';

@Controller('')
export class HomeController {
	@Get('')
	index(@Res() response: Response): void {
		return renderReact(response);
	}
}
