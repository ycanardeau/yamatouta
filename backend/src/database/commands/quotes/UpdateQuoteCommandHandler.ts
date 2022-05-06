import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { WebLinkObject } from '../../../dto/WebLinkObject';
import { QuoteObject } from '../../../dto/quotes/QuoteObject';
import { Artist } from '../../../entities/Artist';
import { Commit } from '../../../entities/Commit';
import { Quote } from '../../../entities/Quote';
import { User } from '../../../entities/User';
import { Permission } from '../../../models/Permission';
import { QuoteOptionalFields } from '../../../models/QuoteOptionalFields';
import { QuoteType } from '../../../models/QuoteType';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { AuditLogEntryFactory } from '../../../services/AuditLogEntryFactory';
import { PermissionContext } from '../../../services/PermissionContext';
import { WebAddressFactory } from '../../../services/WebAddressFactory';
import { syncWebLinks } from '../entries/syncWebLinks';

export class UpdateQuoteParams {
	static readonly schema = Joi.object<UpdateQuoteParams>({
		quoteId: Joi.number().optional(),
		text: Joi.string().required().trim().max(200),
		quoteType: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(QuoteType)),
		locale: Joi.string().required().trim(),
		artistId: Joi.number().required(),
		webLinks: Joi.array().items(WebLinkObject.schema).required(),
	});

	constructor(
		readonly quoteId: number | undefined,
		readonly text: string,
		readonly quoteType: QuoteType,
		readonly locale: string,
		readonly artistId: number,
		readonly webLinks: WebLinkObject[],
	) {}
}

export class UpdateQuoteCommand {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: UpdateQuoteParams,
	) {}
}

@CommandHandler(UpdateQuoteCommand)
export class UpdateQuoteCommandHandler
	implements ICommandHandler<UpdateQuoteCommand>
{
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
		private readonly auditLogEntryFactory: AuditLogEntryFactory,
		@InjectRepository(Quote)
		private readonly quoteRepo: EntityRepository<Quote>,
		private readonly webAddressFactory: WebAddressFactory,
	) {}

	async execute(command: UpdateQuoteCommand): Promise<QuoteObject> {
		const { permissionContext, params } = command;

		permissionContext.verifyPermission(Permission.EditQuotes);

		const result = UpdateQuoteParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const quote = await this.em.transactional(async (em) => {
			const user = await this.userRepo.findOneOrFail({
				id: permissionContext.user?.id,
				deleted: false,
				hidden: false,
			});

			const artist = await this.artistRepo.findOneOrFail({
				id: params.artistId,
				deleted: false,
				hidden: false,
			});

			const quote = await this.quoteRepo.findOneOrFail(
				{
					id: params.quoteId,
					deleted: false,
					hidden: false,
				},
				{ populate: true },
			);

			quote.text = params.text;
			quote.quoteType = params.quoteType;
			quote.locale = params.locale;
			quote.artist = artist;

			await syncWebLinks(
				em,
				quote,
				params.webLinks,
				permissionContext,
				this.webAddressFactory,
				user,
			);

			const commit = new Commit();

			const revision = quote.createRevision({
				commit: commit,
				actor: user,
				event: RevisionEvent.Updated,
				summary: '',
			});

			em.persist(revision);

			const auditLogEntry = this.auditLogEntryFactory.quote_update({
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
			Object.values(QuoteOptionalFields),
		);
	}
}
