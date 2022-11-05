import { workApi } from '@/api/workApi';
import { IWorkLinkDto } from '@/dto/ILinkDto';
import { IWorkDto } from '@/dto/IWorkDto';
import { IWorkLinkUpdateParams } from '@/models/IWorkLinkUpdateParams';
import { LinkType } from '@/models/LinkType';
import { BasicEntryLinkStore } from '@/stores/BasicEntryLinkStore';
import { BasicListEditStore } from '@/stores/BasicListEditStore';
import { action, makeObservable, observable } from 'mobx';

export class WorkLinkEditStore {
	readonly relatedWork = new BasicEntryLinkStore<IWorkDto>((id) =>
		workApi.get({ id: id }),
	);
	@observable linkType = LinkType.Unspecified;
	//readonly beginDate: PartialDateEditStore;
	//readonly endDate: PartialDateEditStore;
	@observable ended = false;

	constructor(private readonly workLink?: IWorkLinkDto) {
		makeObservable(this);

		if (workLink) {
			this.relatedWork.loadEntryById(workLink.relatedWork.id);
			this.linkType = workLink.linkType;
			this.ended = workLink.ended;
		}
	}

	@action setLinkType = (value: LinkType): void => {
		this.linkType = value;
	};

	toParams = (): IWorkLinkUpdateParams => {
		return {
			id: this.workLink?.id ?? 0,
			relatedWorkId: this.relatedWork.entry?.id ?? 0,
			linkType: this.linkType,
			beginDate: {} /* TODO */,
			endDate: {} /* TODO */,
			ended: this.ended,
		};
	};
}

export class WorkLinkListEditStore extends BasicListEditStore<
	WorkLinkEditStore,
	IWorkLinkDto
> {
	constructor(objects: IWorkLinkDto[]) {
		super(WorkLinkEditStore, objects);
	}

	toParams = (): IWorkLinkUpdateParams[] => {
		return this.items.map((item) => item.toParams());
	};
}
