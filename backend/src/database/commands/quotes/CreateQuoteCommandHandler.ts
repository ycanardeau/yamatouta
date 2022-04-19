import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';

import { QuoteObject } from '../../../dto/quotes/QuoteObject';
import { Artist } from '../../../entities/Artist';
import { Commit } from '../../../entities/Commit';
import { Quote } from '../../../entities/Quote';
import { User } from '../../../entities/User';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { AuditLogEntryFactory } from '../../../services/AuditLogEntryFactory';
import { PermissionContext } from '../../../services/PermissionContext';
import { CommandHandler, ICommandHandler } from '../ICommandHandler';
import { UpdateQuoteCommand } from './UpdateQuoteCommandHandler';

export class CreateQuoteCommand extends UpdateQuoteCommand {}

@CommandHandler(CreateQuoteCommand)
export class CreateQuoteCommandHandler
	implements ICommandHandler<CreateQuoteCommand>
{
	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
		private readonly auditLogEntryFactory: AuditLogEntryFactory,
	) {}

	async execute(command: CreateQuoteCommand): Promise<QuoteObject> {
		this.permissionContext.verifyPermission(Permission.CreateQuotes);

		const result = CreateQuoteCommand.schema.validate(command, {
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

			const quote = new Quote({
				text: command.text,
				quoteType: command.quoteType,
				locale: command.locale,
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

			const auditLogEntry = this.auditLogEntryFactory.quote_create({
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
