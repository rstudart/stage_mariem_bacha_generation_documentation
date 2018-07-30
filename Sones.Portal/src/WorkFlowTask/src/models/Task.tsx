import { ITask } from "./ITask";
import { ITaskConfiguration } from "./ITaskConfiguration";
import { IItemInfo } from "./IItemInfo";

export class Task implements ITask {
    public WFInstanceID: number = 0;
    public WFIdentifier: string = "";
    public SerializedTaskInfo: string = "";
    public SerializedItemInfo: string = "";
    public Status: string = "";
    public AssignedTo: SP.FieldUserValue | undefined;
    public TaskInfo: ITaskConfiguration = {
        Actions: [],
        Fields: [],
        Title: ""
    };
    public ItemInfo: IItemInfo = {
        ItemID: 0,
        StatusColumn: "",
        ListUrl: ""
    };
}