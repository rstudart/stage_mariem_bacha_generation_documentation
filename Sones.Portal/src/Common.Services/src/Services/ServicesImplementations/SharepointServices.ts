import { ISharePointServices } from "../ISharepointServices";
import { memoize } from "office-ui-fabric-react";
import { PropertyQuery, UserDirectionQuery, TemplateQuery } from "../../Constants/QueryConstants";
import axios, { AxiosRequestConfig } from "axios";

const ID: string = "ID";
const Attachments: string = "Attachments";

export class SharePointOperations implements ISharePointServices {
    public async AddOrUpdateItem(item: any, listUrl: string, itemCreateInfo?: SP.ListItemCreationInformation, siteUrl?: string)
        : Promise<number> {
        let sharepointItem: SP.ListItem<any>;
        if (item[ID] === undefined || item[ID] === 0) {
            sharepointItem = await this.GetNewItem(listUrl, itemCreateInfo, siteUrl);
        } else {
            sharepointItem = await this.GetItemById(listUrl, item[ID], siteUrl);
        }
        let enumerator: IEnumerator<SP.Field> = (await this.GetFields(listUrl, siteUrl)).getEnumerator();

        while (enumerator.moveNext()) {
            let internalName: string = enumerator.get_current().get_internalName();
            if (item[internalName] !== undefined && internalName !== ID && internalName !== Attachments) {
                sharepointItem.set_item(internalName, item[internalName]);
            }
        }
        return this.UpdateItem(sharepointItem, siteUrl);
    }

    public async AttachFileToItem(listUrl: string, id: number, file: File, siteUrl?: string)
        : Promise<boolean> {
        try {
            let list: SP.List = await this.GetListByUrl(listUrl, siteUrl);
            if (siteUrl === undefined) {
                siteUrl = await this.GetCurrentSiteUrl();
            }

            let url: string = siteUrl +
                `/_api/web/lists/getbytitle('${list.get_title()}')/items(${id})/AttachmentFiles/add(FileName='${file.name}')`;
            let data: ArrayBuffer = await this.ReadArrayBuffer(file);
            let conf: AxiosRequestConfig = {
                headers: {
                    "Accept": "application/json; odata=verbose",
                    "content-type": "application/json; odata=verbose",
                    "X-RequestDigest": this.XRequestDigiest
                }
            };
            await axios.post(url, data, conf);
            return true;
        } catch (e) {
            throw {
                get_message: () => { return e; }
            };
        }
    }

    public async GetAttatchementsUrls(listUrl: string, id: number, siteUrl?: string): Promise<string[]> {
        let context: SP.ClientContext = this.GetContext(siteUrl);
        let item: SP.ListItem = await this.GetItemById(listUrl, id, siteUrl);
        let attachments: SP.AttachmentCollection = await this.LoadItem(context, item.get_attachmentFiles());
        return attachments.get_data().map(val => val.get_serverRelativeUrl());
    }

    public async GetChoices(listUrl: string, columnName: string, siteUrl?: string): Promise<string[]> {
        let fields: SP.FieldCollection = await this.GetFields(listUrl, siteUrl);
        let field: SP.FieldMultiChoice = fields.getByInternalNameOrTitle(columnName) as SP.FieldMultiChoice;
        return field.get_choices();
    }
    public GetColumnValue<T = string>(item: SP.ListItem<any>, columnName: string): T {
        return item.get_fieldValues()[columnName] as T;
    }
    public GetConfigurationProperty(key: string): Promise<string> {
        let loc: Location = window.location;
        let baseURL: string = loc.protocol + "//" + loc.hostname;
        if (typeof loc.port !== "undefined" && loc.port !== "") {
            baseURL += ":" + loc.port;
        }
        let configuationClientContext: SP.ClientContext = this.GetContext(baseURL + "/sites/Config");
        let properties: SP.PropertyValues = configuationClientContext.get_web().get_allProperties();
        configuationClientContext.load(properties);
        return new Promise<string>((resolve) => {
            configuationClientContext.executeQueryAsync(
                async () => {
                    let propertyValues: any = properties.get_fieldValues();
                    let selectedPropertyValue: any = propertyValues[key];
                    if (selectedPropertyValue != null) {
                        resolve(selectedPropertyValue);
                    } else {
                        try {
                            let items: SP.ListItemCollection =
                                await this.GetItems(String.format(PropertyQuery, key), "Lists/Config", baseURL + "/sites/Config");
                            if (items.get_count() <= 0) {
                                throw Error("404 Property not found");
                            } else { resolve(items.get_item(0).get_fieldValues().Value); }
                        } catch (e) {
                            throw Error(e);

                        }
                    }
                },
                async () => {
                    try {
                        let items: SP.ListItemCollection =
                            await this.GetItems(String.format(PropertyQuery, key), "Lists/Config", baseURL + "/sites/Config");
                        if (items.get_count() <= 0) {
                            throw Error("404 Property not found");
                        } else { resolve(items.get_item(0).get_fieldValues().Value); }
                    } catch (e) {
                        throw Error(e);

                    }
                }
            );
        }
        );
    }

    @memoize
    public GetContext(url?: string): SP.ClientContext {
        if (url === undefined) {
            return SP.ClientContext.get_current();
        } else {
            return new SP.ClientContext(url);
        }
    }

    public async GetCurrentUser(): Promise<SP.User> {
        let currentContext: SP.ClientContext = this.GetContext();
        let currentUser: SP.User = currentContext.get_web().get_currentUser();
        return await this.LoadItem(currentContext, currentUser);
    }

    public async GetCurrentUserDirection(): Promise<{ CodeDirection: string; NameDirection: string; }> {
        let result: SP.ListItemCollection = await this.GetItems(UserDirectionQuery, "Lists/Employes", "/sites/Config");
        if (result.get_count() > 0) {
            let employee: SP.ListItem = result.get_data()[0];
            var lookup: SP.FieldLookupValue = employee.get_fieldValues().LookUpDirection as SP.FieldLookupValue;
            let direction: any = (await this.GetItemById("Lists/Directions", lookup.get_lookupId(), "/sites/Config")).get_fieldValues();
            return ({
                CodeDirection: direction.CodeDirection,
                NameDirection: direction.NameDirection
            });
        } else {
            console.error("L'utilisateur n'a pas été trouvé");
            throw Error("L'utilisateur n'a pas été trouvé");
        }
    }

    public async GetCurrentUserGroups(): Promise<SP.GroupCollection> {
        let currentContext: SP.ClientContext = this.GetContext();
        let currentUser: SP.User = await this.GetCurrentUser();
        let userGroups: SP.GroupCollection = currentUser.get_groups();
        return await this.LoadItem(currentContext, userGroups);
    }
    public async GetCurrentSiteUrl(): Promise<string> {
        let currentContext: SP.ClientContext = this.GetContext();
        return (await this.LoadItem(currentContext, currentContext.get_site())).get_url();
    }

    public async GetFields(listUrl: string, siteUrl?: string): Promise<SP.FieldCollection> {
        let list: SP.List = await this.GetListByUrl(listUrl, siteUrl);
        let fields: SP.FieldCollection = list.get_fields();
        let context: SP.ClientContext = this.GetContext(siteUrl);
        return await this.LoadItem(context, fields);
    }
    public async GetItemById(listUrl: string, id: number, siteUrl?: string): Promise<SP.ListItem<any>> {
        let context: SP.ClientContext = this.GetContext(siteUrl);
        let list: SP.List = await this.GetListByUrl(listUrl, siteUrl);
        let item: SP.ListItem = list.getItemById(id);
        return await this.LoadItem(context, item);
    }

    public async GetItems(queryView: string, listUrl: string, siteUrl?: string): Promise<SP.ListItemCollection<any>> {
        let context: SP.ClientContext = this.GetContext(siteUrl);
        let camlQuery: SP.CamlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml(queryView);
        let list: SP.List = await this.GetListByUrl(listUrl, siteUrl);
        let collListItem: SP.ListItemCollection = list.getItems(camlQuery);
        return await this.LoadItem(context, collListItem);
    }
    public async GetListByUrl(listUrl: string, siteUrl?: string): Promise<SP.List<any>> {
        let context: SP.ClientContext = this.GetContext(siteUrl);
        if (!listUrl.startsWith("/")) {
            listUrl = "/" + listUrl;
        }
        let site: SP.Site = await this.LoadItem(context, context.get_site());
        return await this.LoadItem(context, context.get_web().getList(site.get_url() + listUrl));
    }
    public async GetListByID(listId: string, siteUrl?: string): Promise<SP.List<any>> {
        let context: SP.ClientContext = this.GetContext(siteUrl);
        return await this.LoadItem(context, context.get_web().get_lists().getById(listId));
    }
    public GetListByTitle(listTitle: string, siteUrl?: string): SP.List<any> {
        let context: SP.ClientContext = this.GetContext(siteUrl);
        return context.get_web().get_lists().getByTitle(listTitle);
    }
    public GetLookupId(item: SP.ListItem<any>, columnName: string): number {
        let lookUp: SP.FieldLookupValue = item.get_fieldValues()[columnName] as SP.FieldLookupValue;
        return lookUp.get_lookupId();
    }
    public GetLookupValue(item: SP.ListItem<any>, columnName: string): SP.FieldLookupValue {
        return this.GetColumnValue<SP.FieldLookupValue>(item, columnName);
    }
    // tslint:disable-next-line:max-line-length
    public async GetNewItem(listUrl: string, itemCreateInfo: SP.ListItemCreationInformation = new SP.ListItemCreationInformation(), siteUrl?: string): Promise<SP.ListItem<any>> {
        let list: SP.List = await this.GetListByUrl(listUrl, siteUrl);
        return list.addItem(itemCreateInfo);
    }
    public async GetTemplate(identifiantTemplate: string): Promise<string> {
        let loc: Location = window.location;
        let baseURL: string = loc.protocol + "//" + loc.hostname;
        if (typeof loc.port !== "undefined" && loc.port !== "") {
            baseURL += ":" + loc.port;
        }
        // tslint:disable-next-line:max-line-length
        let items: SP.ListItemCollection = await this.GetItems(String.format(TemplateQuery, identifiantTemplate), "Lists/TemplateImpression", baseURL + "/sites/Config");
        if (items.get_count() === 0) {
            alert("Template d'impression inexistante");
            throw Error("La template n'existe pas ");
        }
        return items.get_data()[0].get_fieldValues().Template as string;

    }
    public async GetUserPersonProperties(loginName: string, siteUrl?: string): Promise<SP.UserProfiles.PersonProperties> {
        let context: SP.ClientContext = this.GetContext(siteUrl);
        let peopleManager: SP.UserProfiles.PeopleManager = new SP.UserProfiles.PeopleManager(context);
        let properties: SP.UserProfiles.PersonProperties = peopleManager.getPropertiesFor(loginName);
        return await this.LoadItem(context, properties);
    }
    public async GetUserProfileProperty(property: string, loginName: string, siteUrl?: string): Promise<string> {
        let properties: SP.UserProfiles.PersonProperties = await this.GetUserPersonProperties(loginName, siteUrl);
        return properties.get_userProfileProperties()[property];
    }
    public GetUserValue(item: SP.ListItem<any>, columnName: string): SP.FieldUserValue {
        return this.GetColumnValue<SP.FieldUserValue>(item, columnName);
    }
    public async IsCurrentUserMemberOfGroup(groupName: string): Promise<boolean> {
        let groups: SP.GroupCollection = await this.GetCurrentUserGroups();
        let groupUserEnumerator: IEnumerator<SP.Group> = groups.getEnumerator();
        while (groupUserEnumerator.moveNext()) {
            let currentGroup: SP.Group = groupUserEnumerator.get_current();
            if (currentGroup.get_title() === groupName) {
                return true;
            }
        }
        return false;
    }
    public async UpdateItem(item: SP.ListItem<any>, siteUrl?: string): Promise<number> {
        let clientContext: SP.ClientContext = this.GetContext(siteUrl);
        item.update();
        return (await this.LoadItem(clientContext, item)).get_id();
    }
    public async UploadFileToSiteDocuments(file: File, name?: string, siteUrl?: string): Promise<string> {
        let fileCreateInfo: SP.FileCreationInformation = new SP.FileCreationInformation();
        fileCreateInfo.set_url(name + "-" + file.name);
        fileCreateInfo.set_content(new SP.Base64EncodedByteArray(await this.ReadFileBase64(file)));
        let libraryList: SP.List = await this.GetListByUrl("Documents", siteUrl);
        let newFile: SP.File = libraryList.get_rootFolder().get_files().add(fileCreateInfo);
        return (await this.LoadItem(this.GetContext(), newFile)).get_serverRelativeUrl();
    }
    private async LoadItem<T extends SP.ClientObject>(context: SP.ClientContext, element: T): Promise<T> {
        context.load(element);
        return new Promise<T>((resolve, reject) => {
            context.executeQueryAsync(
                () => resolve(element),
                (_sender: any, args: SP.ClientRequestFailedEventArgs) => {
                    console.error(args);
                    alert(args.get_message());
                    reject(args);
                }
            );
        });
    }
    private get XRequestDigiest(): string {
        return (document.getElementById("__REQUESTDIGEST") as any).value;
    }
    private ReadFileBase64 = (file: File): Promise<string> => {
        let fileReader: FileReader = new FileReader();
        return new Promise<string>((resolve, reject) => {
            fileReader.onerror = () => {
                reject("Error reading the file");
            };
            fileReader.onloadend = () => {
                console.log("done");
                resolve(fileReader.result);
            };
            fileReader.readAsDataURL(file);
        });
    }
    private ReadArrayBuffer = (file: File): Promise<ArrayBuffer> => {
        let fileReader: FileReader = new FileReader();
        return new Promise<ArrayBuffer>((resolve, reject) => {
            fileReader.onerror = () => {
                reject("Error reading the file");
            };
            fileReader.onloadend = () => {
                console.log("done");
                resolve(fileReader.result);
            };
            fileReader.readAsArrayBuffer(file);
        });
    }
}