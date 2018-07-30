export class Context {
    constructor() {
        if (Context.TaskId === undefined || Context.TaskListUrl === undefined) {
            var urlParams: URLSearchParams = new URLSearchParams(window.location.search);
            Context.TaskId = urlParams.has("TaskId") ? parseInt(urlParams.get("TaskId") as string, 10) : undefined;
            Context.TaskListUrl = urlParams.has("TaskId") ? urlParams.get("TaskListUrl") as string : undefined;
        }
    }
    public static TaskListUrl: string | undefined;
    public static TaskId: number | undefined;
}
const context: Context = new Context();
export { context };