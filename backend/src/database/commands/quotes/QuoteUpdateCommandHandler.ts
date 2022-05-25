import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { QuoteObject } from '../../../dto/QuoteObject';
import { Artist } from '../../../entities/Artist';
import { QuoteAuditLogEntry } from '../../../entities/AuditLogEntry';
import { Commit } from '../../../entities/Commit';
import { Quote } from '../../../entities/Quote';
import { AuditedAction } from '../../../models/AuditedAction';
import { Permission } from '../../../models/Permission';
import { QuoteOptionalField } from '../../../models/QuoteOptionalField';
import { QuoteType } from '../../../models/QuoteType';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { PermissionContext } from '../../../services/PermissionContext';
import { WebLinkService } from '../../../services/WebLinkService';
import { WebLinkUpdateParams } from '../WebLinkUpdateParams';

export class QuoteUpdateParams {
	constructor(
		readonly id: number,
		readonly text: string,
		readonly quoteType: QuoteType,
		readonly locale: string,
		readonly artistId: number,
		readonly webLinks: WebLinkUpdateParams[],
	) {}

	static readonly schema = Joi.object<QuoteUpdateParams>({
		id: Joi.number().required(),
		text: Joi.string().required().trim().max(200),
		quoteType: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(QuoteType)),
		locale: Joi.string().required().trim(),
		artistId: Joi.number().required(),
		webLinks: Joi.array().items(WebLinkUpdateParams.schema).required(),
	});
}

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
	) {}

	async execute(command: QuoteUpdateCommand): Promise<QuoteObject> {
		const { permissionContext, params } = command;

		permissionContext.verifyPermission(Permission.Quote_Update);

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
				? new Quote()
				: await this.quoteRepo.findOneOrFail(
						{
							id: params.id,
							deleted: false,
							hidden: false,
						},
						{ populate: true },
				  );

			em.persist(quote);

			const latestSnapshot = isNew ? undefined : quote.takeSnapshot();

			quote.text = params.text;
			quote.quoteType = params.quoteType;
			quote.locale = params.locale;
			quote.artist = artist;

			await this.webLinkService.sync(
				em,
				quote,
				params.webLinks,
				permissionContext,
				user,
			);

			const commit = new Commit();

			const revision = quote.createRevision({
				commit: commit,
				actor: user,
				event: isNew ? RevisionEvent.Created : RevisionEvent.Updated,
				summary: '',
			});

			if (revision.snapshot.contentEquals(latestSnapshot)) {
				throw new BadRequestException('Nothing has changed.');
			}

			em.persist(revision);

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

		return new QuoteObject(
			quote,
			permissionContext,
			Object.values(QuoteOptionalField),
		);
	}
}
