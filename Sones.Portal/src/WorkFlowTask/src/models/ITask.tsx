import { ITaskConfiguration } from "./ITaskConfiguration";
import { IItemInfo } from "./IItemInfo";

export interface ITask {
    WFInstanceID: number;
    WFIdentifier: string;
    TaskInfo: ITaskConfiguration;
    ItemInfo: IItemInfo;
    SerializedTaskInfo: string;
    SerializedItemInfo: string;
    AssignedTo: SP.FieldUserValue | undefined;
    Status: string;
}