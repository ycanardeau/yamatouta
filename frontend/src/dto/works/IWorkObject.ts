import { IEntryWithIdAndName } from '../../models/IEntryWithIdAndName';
import { WorkType } from '../../models/WorkType';

export interface IWorkObject extends IEntryWithIdAndName {
	workType: WorkType;
}
