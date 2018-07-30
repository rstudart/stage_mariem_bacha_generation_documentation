import "url-search-params-polyfill";
import { SharePointServices } from "../../../Common.Services/src/Index";
import { ITask } from "../models/ITask";
import { Context } from "../store/Context";
const workFlowUnstanceUrl: string = "Lists/WorkFlowInstance";
export class WorkflowServices {

    public static async UpdateItem(ListUrl: string, item: any, note: string, state: string): Promise<void> {
        await SharePointServices.AddOrUpdateItem(item, ListUrl);
        await WorkflowServices.SetWorkFlowInstance(item.WFInstanceID, note, state);
    }

    public static async GetTaskConfiguration(): Promise<ITask> {
        if (Context.TaskId !== undefined && Context.TaskListUrl !== undefined) {
            let data: SP.ListItem<ITask> =
                await SharePointServices.GetItemById(Context.TaskListUrl, Context.TaskId);
            return data.get_fieldValues();
        }
        throw Error("Paramètre(s) manquant(s)");
    }

    public static async SetWorkFlowInstance(instanceID: number, note: string, state: string): Promise<void> {
        let loc: Location = window.location;
        let baseURL: string = loc.protocol + "//" + loc.hostname;
        if (typeof loc.port !== "undefined" && loc.port !== "") {
            baseURL += ":" + loc.port;
        }
        let workFlowInstance: any = {
            ID: instanceID,
            WFState: "En cours",
            WFItemState: state,
            WFNote: note
        };
        let task: any = {
            ID: Context.TaskId,
            PercentComplete: 1,
            Status: "Terminé"
        };
        await SharePointServices.AddOrUpdateItem(workFlowInstance, workFlowUnstanceUrl, undefined, baseURL + "/sites/config");
        await SharePointServices.AddOrUpdateItem(task, Context.TaskListUrl as string, undefined);
    }

    public static async GetWebUrl(): Promise<string> {
        return await SharePointServices.GetCurrentSiteUrl();
    }
    public static async GetItem(listUrl: string, itemId: number): Promise<any> {
        let data: SP.ListItem<any> = await SharePointServices.GetItemById(listUrl, itemId);
        return data.get_fieldValues();
    }
    public static async GetFields(listUrl: string): Promise<Array<SP.Field>> {
        return (await SharePointServices.GetFields(listUrl)).get_data();

    }



    public static async IsAllowed(user: SP.FieldUserValue): Promise<boolean> {
        let value: string = user.get_lookupValue();
        let currentUser: SP.User = await SharePointServices.GetCurrentUser();
        if (currentUser.get_id() === user.get_lookupId()) {
            return true;
        } else {
            return SharePointServices.IsCurrentUserMemberOfGroup(value);
        }
    }
}
