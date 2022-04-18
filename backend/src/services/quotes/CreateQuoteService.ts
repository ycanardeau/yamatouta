import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';

import { QuoteObject } from '../../dto/quotes/QuoteObject';
import { Artist } from '../../entities/Artist';
import { Commit } from '../../entities/Commit';
import { Quote } from '../../entities/Quote';
import { User } from '../../entities/User';
import { Permission } from '../../models/Permission';
import { RevisionEvent } from '../../models/RevisionEvent';
import {
	IUpdateQuoteBody,
	updateQuoteBodySchema,
} from '../../requests/quotes/IUpdateQuoteBody';
import { AuditLogger } from '../AuditLogger';
import { PermissionContext } from '../PermissionContext';

@Injectable()
export class CreateQuoteService {
	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
		private readonly auditLogger: AuditLogger,
	) {}

	async execute(params: IUpdateQuoteBody): Promise<QuoteObject> {
		this.permissionContext.verifyPermission(Permission.CreateQuotes);

		const result = updateQuoteBodySchema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const quote = await this.em.transactional(async (em) => {
			const user = await this.userRepo.findOneOrFail({
				id: this.permissionContext.user?.id,
				deleted: false,
				hidden: false,
			});

			const artist = await this.artistRepo.findOneOrFail({
				id: params.artistId,
				deleted: false,
				hidden: false,
			});

			const quote = new Quote({
				text: params.text,
				quoteType: params.quoteType,
				locale: params.locale,
				artist: artist,
			});

			em.persist(quote);

			const commit = new Commit();

			const revision = quote.createRevision({
				commit: commit,
				actor: user,
				event: RevisionEvent.Created,
				summary: '',
			});

			em.persist(revision);

			this.auditLogger.quote_create({
				actor: user,
				actorIp: this.permissionContext.remoteIpAddress,
				quote: quote,
			});

			return quote;
		});

		return new QuoteObject(quote, this.permissionContext);
	}
}
