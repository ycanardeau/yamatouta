import { renderReact } from '@/controllers/renderReact';
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('settings')
export class SettingsController {
	@Get('')
	index(@Res() response: Response): void {
		return renderReact(response);
	}
}
