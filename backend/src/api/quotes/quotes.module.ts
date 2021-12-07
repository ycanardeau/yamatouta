import { Module } from '@nestjs/common';

import { GetQuoteController } from './get-quote/get-quote.controller';
import { GetQuoteService } from './get-quote/get-quote.service';
import { ListQuotesController } from './list-quotes/list-quotes.controller';
import { ListQuotesService } from './list-quotes/list-quotes.service';

@Module({
	providers: [ListQuotesService, GetQuoteService],
	controllers: [ListQuotesController, GetQuoteController],
})
export class QuotesModule {}
