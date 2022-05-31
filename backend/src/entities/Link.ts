import { Embedded, Entity, Enum, Property } from '@mikro-orm/core';

import { LinkType } from '../models/LinkType';
import { PartialDate } from './PartialDate';

// Schema from: https://github.com/metabrainz/musicbrainz-server/blob/6024ab554fecbb1156e1bd06c523305512f1da69/lib/MusicBrainz/Server/Data/Link.pm.
@Entity({ abstract: true })
export abstract class Link {
	@Enum()
	linkType: LinkType;

	@Embedded()
	beginDate: PartialDate;

	@Embedded()
	endDate: PartialDate;

	@Property()
	ended: boolean;

	protected constructor({
		linkType,
		beginDate,
		endDate,
		ended,
	}: {
		linkType: LinkType;
		beginDate: PartialDate;
		endDate: PartialDate;
		ended: boolean;
	}) {
		this.linkType = linkType;
		this.beginDate = beginDate;
		this.endDate = endDate;
		this.ended = ended;
	}
}
