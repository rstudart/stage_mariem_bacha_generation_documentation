export interface ISharePointServices {
    /** if item .ID =0 create new item else update item with same id
     * support one folder in root folder
     */
    AddOrUpdateItem(item: any, listUrl: string, itemCreateInfo?: SP.ListItemCreationInformation, siteUrl?: string): Promise<number>;
    AttachFileToItem(listUrl: string, id: number, file: File, siteUrl?: string): Promise<boolean>;
    GetAttatchementsUrls(listUrl: string, id: number, siteUrl?: string): Promise<Array<string>>;
    GetChoices(listUrl: string, columnName: string, siteUrl?: string): Promise<Array<string>>;
    GetColumnValue<T = string>(item: SP.ListItem<any>, columnName: string): T;
    GetConfigurationProperty(key: string): Promise<string>;
    GetContext(url?: string): SP.ClientContext;
    GetCurrentUser(): Promise<SP.User>;
    GetCurrentUserDirection(): Promise<{ CodeDirection: string, NameDirection: string }>;
    GetCurrentUserGroups(): Promise<SP.GroupCollection>;
    GetCurrentSiteUrl():Promise<string>;
    GetFields(listUrl: string, siteUrl?: string): Promise<SP.FieldCollection>;
    GetItemById(listUrl: string, id: number, siteUrl?: string): Promise<SP.ListItem>;
    GetItems(queryView: string, listUrl: string, siteUrl?: string): Promise<SP.ListItemCollection<any>>;
    GetListByUrl(listUrl: string, siteUrl?: string): Promise<SP.List>;
    GetListByID(listId: string, siteUrl?: string): Promise<SP.List>;
    GetListByTitle(listUrl: string, siteUrl?: string): SP.List<any>;
    GetLookupId(item: SP.ListItem<any>, columnName: string): number;
    GetLookupValue(item: SP.ListItem<any>, columnName: string): SP.FieldLookupValue;
    GetNewItem(listUrl: string, itemCreateInfo?: SP.ListItemCreationInformation, siteUrl?: string): Promise<SP.ListItem<any>>;
    GetTemplate(identifiantTemplate: string): Promise<string>;
    GetUserPersonProperties(loginName: string, siteUrl?: string): Promise<SP.UserProfiles.PersonProperties>;
    GetUserProfileProperty(property: string, loginName: string, siteUrl?: string): Promise<string>;
    GetUserValue(item: SP.ListItem<any>, columnName: string): SP.FieldUserValue;
    IsCurrentUserMemberOfGroup(groupName: string): Promise<boolean>;
    UpdateItem(item: SP.ListItem, siteUrl?: string): Promise<number>;
    UploadFileToSiteDocuments(file: File, name?: string, siteUrl?: string): Promise<string>;
}
