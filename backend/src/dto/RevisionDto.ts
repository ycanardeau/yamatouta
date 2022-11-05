import { UserDto } from '@/dto/UserDto';
import { Revision } from '@/entities/Revision';
import { EntryWithRevisions } from '@/models/Entry';
import { Permission } from '@/models/Permission';
import { RevisionEvent } from '@/models/RevisionEvent';
import { Snapshot } from '@/models/snapshots/Snapshot';
import { PermissionContext } from '@/services/PermissionContext';
import { NotFoundException } from '@nestjs/common';

export class RevisionDto {
	private constructor(
		readonly createdAt: Date,
		readonly actor: UserDto,
		readonly event: RevisionEvent,
	) {}

	static create(
		permissionContext: PermissionContext,
		revision: Revision<EntryWithRevisions, Snapshot>,
	): RevisionDto {
		if (!permissionContext.hasPermission(Permission.ViewRevisions))
			throw new NotFoundException();

		permissionContext.verifyDeletedAndHidden(revision.entry);

		return new RevisionDto(
			revision.createdAt,
			UserDto.create(permissionContext, revision.actor.getEntity()),
			revision.event,
		);
	}
}
