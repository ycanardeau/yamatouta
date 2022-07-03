import { EntityManager, EntityRepository, Reference } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import remark from 'remark';
import strip from 'strip-markdown';

import { QuoteObject } from '../../../dto/QuoteObject';
import { Artist } from '../../../entities/Artist';
import { QuoteAuditLogEntry } from '../../../entities/AuditLogEntry';
import { Quote } from '../../../entities/Quote';
import { AuditedAction } from '../../../models/AuditedAction';
import { HashtagLinkUpdateParams } from '../../../models/HashtagLinkUpdateParams';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { QuoteOptionalField } from '../../../models/quotes/QuoteOptionalField';
import { QuoteUpdateParams } from '../../../models/quotes/QuoteUpdateParams';
import { HashtagLinkService } from '../../../services/HashtagLinkService';
import { NgramConverter } from '../../../services/NgramConverter';
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
	static readonly populate = [
		'searchIndex',
		'artist',
		'webLinks',
		'webLinks.address',
		'webLinks.address.host',
		'workLinks',
		'workLinks.relatedWork',
		'hashtagLinks',
		'hashtagLinks.relatedHashtag',
	] as const;

	constructor(
		private readonly em: EntityManager,
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
		@InjectRepository(Quote)
		private readonly quoteRepo: EntityRepository<Quote>,
		private readonly hashtagLinkService: HashtagLinkService,
		private readonly webLinkService: WebLinkService,
		private readonly workLinkService: WorkLinkService,
		private readonly revisionService: RevisionService,
		private readonly ngramConverter: NgramConverter,
	) {}

	private extractHashtags(text: string): { name: string; label: string }[] {
		const matches = text.matchAll(/\[(.*?)\]\(#([あ-ん]+)\)/g);

		if (!matches) return [];

		return Array.from(matches).map((match) => ({
			name: match[2],
			label: match[1],
		}));
	}

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
			const actor = await permissionContext.getCurrentUser(em);

			const artist = await this.artistRepo.findOneOrFail({
				id: params.artistId,
			});

			permissionContext.verifyDeletedAndHidden(artist);

			const quote = isNew
				? new Quote(actor)
				: await this.quoteRepo.findOneOrFail(
						{ id: params.id },
						{ populate: QuoteUpdateCommandHandler.populate },
				  );

			permissionContext.verifyDeletedAndHidden(quote);

			em.persist(quote);

			await this.revisionService.create(
				em,
				quote,
				async () => {
					quote.text = params.text;
					quote.plainText = String(
						await remark().use(strip).process(params.text),
					);
					quote.quoteType = params.quoteType;
					quote.locale = params.locale;
					quote.artist = Reference.create(artist);

					quote.updateSearchIndex(this.ngramConverter);

					const hashtags = this.extractHashtags(params.text);

					const hashtagLinks: HashtagLinkUpdateParams[] =
						hashtags.map(({ name, label }) => ({
							id: 0,
							name: name,
							label: label,
						}));

					await this.hashtagLinkService.sync(
						em,
						quote,
						hashtagLinks,
						permissionContext,
						actor,
					);

					await this.webLinkService.sync(
						em,
						quote,
						params.webLinks,
						permissionContext,
						actor,
					);

					await this.workLinkService.sync(
						em,
						quote,
						params.workLinks,
						permissionContext,
					);
				},
				actor,
				isNew ? RevisionEvent.Created : RevisionEvent.Updated,
				false,
			);

			const auditLogEntry = new QuoteAuditLogEntry({
				action: isNew
					? AuditedAction.Quote_Create
					: AuditedAction.Quote_Update,
				quote: quote,
				actor: actor,
				actorIp: permissionContext.clientIp,
			});

			em.persist(auditLogEntry);

			return quote;
		});

		return QuoteObject.create(
			permissionContext,
			quote,
			Object.values(QuoteOptionalField),
		);
	}
}
