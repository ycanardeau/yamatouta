import { EntityManager, EntityRepository, Reference } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { QuoteObject } from '../../../dto/QuoteObject';
import { Artist } from '../../../entities/Artist';
import { QuoteAuditLogEntry } from '../../../entities/AuditLogEntry';
import { Quote } from '../../../entities/Quote';
import { AuditedAction } from '../../../models/AuditedAction';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { QuoteOptionalField } from '../../../models/quotes/QuoteOptionalField';
import { QuoteUpdateParams } from '../../../models/quotes/QuoteUpdateParams';
import { PermissionContext } from '../../../services/PermissionContext';
import { RevisionService } from '../../../services/RevisionService';
import { WebLinkService } from '../../../services/WebLinkService';
import { WorkLinkService } from '../../../services/WorkLinkService';

export class QuoteUpdateCommand {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: QuoteUpdateParams,
	) {}
}

@CommandHandler(QuoteUpdateCommand)
export class QuoteUpdateCommandHandler
	implements ICommandHandler<QuoteUpdateCommand>
{
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
		@InjectRepository(Quote)
		private readonly quoteRepo: EntityRepository<Quote>,
		private readonly webLinkService: WebLinkService,
		private readonly workLinkService: WorkLinkService,
		private readonly revisionService: RevisionService,
	) {}

	async execute(command: QuoteUpdateCommand): Promise<QuoteObject> {
		const { permissionContext, params } = command;

		permissionContext.verifyPermission(Permission.UpdateQuotes);

		const result = QuoteUpdateParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const isNew = params.id === 0;

		const quote = await this.em.transactional(async (em) => {
			const user = await permissionContext.getCurrentUser(em);

			const artist = await this.artistRepo.findOneOrFail({
				id: params.artistId,
				deleted: false,
				hidden: false,
			});

			const quote = isNew
				? new Quote(user)
				: await this.quoteRepo.findOneOrFail(
						{
							id: params.id,
							deleted: false,
							hidden: false,
						},
						{
							// OPTIMIZE
							populate: [
								'artist',
								'webLinks',
								'webLinks.address',
								'webLinks.address.host',
								'workLinks',
								'workLinks.relatedWork',
							],
						},
				  );

			em.persist(quote);

			await this.revisionService.create(
				em,
				quote,
				async () => {
					quote.text = params.text;
					quote.quoteType = params.quoteType;
					quote.locale = params.locale;
					quote.artist = Reference.create(artist);

					await this.webLinkService.sync(
						em,
						quote,
						params.webLinks,
						permissionContext,
						user,
					);

					await this.workLinkService.sync(
						em,
						quote,
						params.workLinks,
						permissionContext,
					);
				},
				user,
				isNew ? RevisionEvent.Created : RevisionEvent.Updated,
				false,
			);

			const auditLogEntry = new QuoteAuditLogEntry({
				action: isNew
					? AuditedAction.Quote_Create
					: AuditedAction.Quote_Update,
				quote: quote,
				actor: user,
				actorIp: permissionContext.clientIp,
			});

			em.persist(auditLogEntry);

			return quote;
		});

		return QuoteObject.create(
			quote,
			permissionContext,
			Object.values(QuoteOptionalField),
		);
	}
}
