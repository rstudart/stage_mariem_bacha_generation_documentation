export interface IService {
    GetItems(query: string, listUrL: string, siteUrl?: string): Promise<any>;
    GetItemByID(Id: string, listUrL: string, siteUrl?: string): Promise<any>;
    GetChoices(columnName: string, listUrL: string, siteUrl?: string): Promise<Array<string>>;
    GetCurrentUserGroups(): Promise<Array<string>>;
    GetNewItem(listUrL: string): Promise<any>;
    SearchUser(UserName: string, GroupeName?: string): Promise<Array<any>>;
    GetUserById(id: Number): Promise<any>;
}