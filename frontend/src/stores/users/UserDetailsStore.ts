import { UserDetailsDto } from '@/dto/UserDetailsDto';

export class UserDetailsStore {
	constructor(readonly user: UserDetailsDto) {}
}
