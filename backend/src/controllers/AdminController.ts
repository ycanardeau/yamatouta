import { renderReact } from '@/controllers/renderReact';
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('admin')
export class AdminController {
	@Get('')
	index(@Res() response: Response): void {
		return renderReact(response);
	}
}
