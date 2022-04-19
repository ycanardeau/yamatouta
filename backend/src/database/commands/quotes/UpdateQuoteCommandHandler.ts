import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Joi, { ObjectSchema } from 'joi';

import { QuoteObject } from '../../../dto/quotes/QuoteObject';
import { Artist } from '../../../entities/Artist';
import { Commit } from '../../../entities/Commit';
import { Quote } from '../../../entities/Quote';
import { User } from '../../../entities/User';
import { Permission } from '../../../models/Permission';
import { QuoteType } from '../../../models/QuoteType';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { AuditLogEntryFactory } from '../../../services/AuditLogEntryFactory';
import { PermissionContext } from '../../../services/PermissionContext';

export class UpdateQuoteCommand {
	static readonly schema: ObjectSchema<UpdateQuoteCommand> = Joi.object({
		quoteId: Joi.number().optional(),
		text: Joi.string().required().trim().max(200),
		quoteType: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(QuoteType)),
		locale: Joi.string().required().trim(),
		artistId: Joi.number().required(),
	});

	constructor(
		readonly quoteId: number | undefined,
		readonly text: string,
		readonly quoteType: QuoteType,
		readonly locale: string,
		readonly artistId: number,
	) {}
}

@CommandHandler(UpdateQuoteCommand)
export class UpdateQuoteCommandHandler
	implements ICommandHandler<UpdateQuoteCommand>
{
	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
		private readonly auditLogEntryFactory: AuditLogEntryFactory,
		@InjectRepository(Quote)
		private readonly quoteRepo: EntityRepository<Quote>,
	) {}

	async execute(command: UpdateQuoteCommand): Promise<QuoteObject> {
		this.permissionContext.verifyPermission(Permission.EditQuotes);

		const result = UpdateQuoteCommand.schema.validate(command, {
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
				id: command.artistId,
				deleted: false,
				hidden: false,
			});

			const quote = await this.quoteRepo.findOneOrFail({
				id: command.quoteId,
				deleted: false,
				hidden: false,
			});

			quote.text = command.text;
			quote.quoteType = command.quoteType;
			quote.locale = command.locale;
			quote.artist = artist;

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
				actorIp: this.permissionContext.clientIp,
			});

			em.persist(auditLogEntry);

			return quote;
		});

		return new QuoteObject(quote, this.permissionContext);
	}
}
