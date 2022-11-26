import { workApi } from '@/api/workApi';
import { IWorkDto } from '@/dto/IWorkDto';
import { WorkSortRule } from '@/models/works/WorkSortRule';
import { WorkType } from '@/models/works/WorkType';
import { PaginationStore } from '@/stores/PaginationStore';
import {
	includesAny,
	LocationStateStore,
	StateChangeEvent,
} from '@vocadb/route-sphere';
import Ajv from 'ajv';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

/* TODO: assert { type: 'json' } */
import schema from './WorkSearchRouteParams.schema.json';

export interface WorkSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: WorkSortRule;
	query?: string;
	workType?: WorkType;
}

// TODO: Use single Ajv instance. See https://ajv.js.org/guide/managing-schemas.html.
const ajv = new Ajv({ coerceTypes: true });

// TODO: Make sure that we compile schemas only once and re-use compiled validation functions. See https://ajv.js.org/guide/getting-started.html.
export const validate = ajv.compile<WorkSearchRouteParams>(schema);

const clearResultsByQueryKeys: (keyof WorkSearchRouteParams)[] = [
	'pageSize',
	'sort',
	'query',
	'workType',
];

export class WorkSearchStore
	implements LocationStateStore<WorkSearchRouteParams>
{
	readonly pagination = new PaginationStore({ pageSize: 50 });
	@observable works: IWorkDto[] = [];
	@observable sort = WorkSortRule.UpdatedDesc;
	@observable query = '';
	@observable submittedQuery = '';
	@observable workType: WorkType | '' = '';

	constructor() {
		makeObservable(this);
	}

	@action setSort = (value: WorkSortRule): void => {
		this.sort = value;
	};

	@action setQuery = (value: string): void => {
		this.query = value;
	};

	@action setSubmittedQuery = (value: string): void => {
		this.submittedQuery = value;
		this.query = value;
	};

	@action setWorkType = (value: WorkType | ''): void => {
		this.workType = value;
	};

	@observable loading = false;

	@action updateResults = async (clearResults: boolean): Promise<void> => {
		if (this.loading) return;

		this.loading = true;
		this.works = [];

		try {
			const paginationParams = this.pagination.toParams(clearResults);

			const result = await workApi.list({
				pagination: paginationParams,
				sort: this.sort,
				query: this.submittedQuery,
				workType: this.workType ? this.workType : undefined,
			});

			runInAction(() => {
				this.works = result.items;

				if (paginationParams.getTotalCount)
					this.pagination.totalItems = result.totalCount;
			});

			return;
		} finally {
			runInAction(() => {
				this.loading = false;
			});
		}
	};

	@computed.struct get locationState(): WorkSearchRouteParams {
		return {
			page: this.pagination.page,
			pageSize: this.pagination.pageSize,
			sort: this.sort,
			query: this.submittedQuery,
			workType: this.workType ? this.workType : undefined,
		};
	}
	set locationState(value: WorkSearchRouteParams) {
		this.pagination.page = value.page ?? 1;
		this.pagination.pageSize = value.pageSize ?? 50;
		this.sort = value.sort ?? WorkSortRule.UpdatedDesc;
		this.setSubmittedQuery(value.query ?? '');
		this.workType = value.workType ?? '';
	}

	validateLocationState = (data: any): data is WorkSearchRouteParams => {
		return validate(data);
	};

	onLocationStateChange = (
		event: StateChangeEvent<WorkSearchRouteParams>,
	): void => {
		const clearResults = includesAny(clearResultsByQueryKeys, event.keys);

		if (!event.popState && clearResults) this.pagination.goToFirstPage();

		this.updateResults(clearResults);
	};

	@action submit = (): void => {
		this.submittedQuery = this.query;
	};
}
