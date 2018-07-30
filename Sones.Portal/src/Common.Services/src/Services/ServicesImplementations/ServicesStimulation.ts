import { IService } from "../IService";
import { Sites } from "./ListsStimulations";


export class ServicesStimulation implements IService {
    SearchUser(_UserName: string, _GroupeName?: string | undefined): Promise<any[]> {
        return new Promise((resolve) => {
            resolve([{
                Id: 1,
                FullName: "Amine Bchir",
                Email: "bchiir@gmail.com"

            },
            {
                Id: 2,
                FullName: "Ghassen Harrath",
                Email: "Ghassen@gmail.com"


            }]);
        });
    }
    GetItemByID(_id: string, _listUrL: string, _siteUrl?: string | undefined): Promise<any> {
        return new Promise((resolve) => {
            resolve({
                Title: "Bon de Commande",
                Actions: [],
                Fields: [{
                    FieldName: "CommandeNumber",
                    Type: "TextFieldConfiguration",
                    FieldConfiguration: {
                        label: "Numero",
                        required: true,
                        Validators: [
                            { Name: "required" },
                            { Name: "maxLength", Arg: 5 },
                            { Name: "minLength", Arg: 4 }],
                        Permissions:
                            [{
                                GroupName: "Groupe 1", GroupPermission: 1
                            },
                            {
                                GroupName: "Groupe 2", GroupPermission: [
                                    { State: "started", Permission: 1 }
                                ]
                            }]
                    }
                },
                {
                    FieldName: "State",
                    Type: "ChoiceConfiguration",
                    FieldConfiguration: {
                        label: "Etat",
                        required: true,
                        multiSelect: true,
                        FieldDefinitionChoicesSrc: true,
                        Validators: [
                            { Name: "required" },
                        ],
                        ListUrl: "Lists/h",
                        Column: "hh",
                        Permissions: [{ GroupName: "Groupe 1", GroupPermission: 1 }, {
                            GroupName: "Groupe 2", GroupPermission: 2
                        }],
                    }
                },
                {
                    FieldName: "Date",
                    Type: "DatePickerConfiguration",
                    FieldConfiguration: {
                        label: "Date",
                        isRequired: true,
                        Validators: [],
                        Permissions: [{ GroupName: "Groupe 1", GroupPermission: 1 }, {
                            GroupName: "Groupe 2", GroupPermission: 2
                        }],
                    }
                },
                {
                    FieldName: "people",
                    Type: "PeoplePickerConfiguration",
                    FieldConfiguration: {
                        label: "people",
                        required: true,
                        Validators: [{ Name: "required" }],
                        Permissions: [{ GroupName: "Groupe 1", GroupPermission: 1 }, {
                            GroupName: "Groupe 2", GroupPermission: 2
                        }],
                    }
                },
                {
                    FieldName: "Fournisseur",
                    Type: "ItemPickerConfiguration",
                    FieldConfiguration: {
                        label: "Fournisseur",
                        required: true,
                        ListUrl: "Lists/Fournisseurs",
                        DisplayedColumn: "nom",
                        Validators: [{ Name: "required" }],
                        Permissions: [{ GroupName: "Groupe 1", GroupPermission: 1 }, {
                            GroupName: "Groupe 2", GroupPermission: 2
                        }],
                    }
                }


                ]
            });
        });
    }
    GetNewItem(listUrL: string): Promise<any> {
        return new Promise((resolve) => { resolve({ url: listUrL }); });
    }
    GetChoices(_columnName: string, _listUrL: string, _siteUrl?: string | undefined): Promise<string[]> {
        return new Promise((resolve) => {
            resolve(["a", "b"]);
        });
    }

    GetUserById(_id: Number): Promise<any> {
        return new Promise((resolve) => {
            resolve({
                Id: 1,
                FullName: "Amine Bchir",
                Email: "bchiir@gmail.com"

            });
        });
    }

    GetCurrentUserGroups(): Promise<string[]> {
        return new Promise((resolve) => {
            resolve(["Groupe 1", "Groupe 2"]);
        });
    }
    public GetItems(query: string, listUrL: string, siteUrl?: string | undefined): Promise<any> {
        let site: any;
        if (siteUrl === undefined) {
            site = Sites[1];
        } else {
            site = Sites.filter(elem => elem.SiteUrl === siteUrl)[0];
        }
        let list: any = site.Lists.filter(elem => elem.ListUrl === listUrL)[0];
        return new Promise<any>((resolve) => {
            resolve(list.Content.filter(item => (item.Name as string).indexOf(query) !== -1));
        });
    }
}