import { Article } from "../models/Article";
import { SharePointServices, helper } from "../../../Common.Services/src/Index";
import { memoize } from "office-ui-fabric-react";
import { IDemande, Demande } from "../models/IDemande";

const articleCodeQuery: string
    = "<View><Query><Where><Or><Contains><FieldRef Name='CodeArticleFournitureBureau' /><Value Type='Text'>{code}" +
    "</Value></Contains><Contains><FieldRef Name='ArticleFournitureBureau' /><Value Type='Text'>{code}" +
    "</Value></Contains></Or></Where></Query><RowLimit>5</RowLimit></View>";

const articleQuery: string
    = "<View><Query><Where><Contains><FieldRef Name='ArticleFournitureBureau' /><Value Type='Text'>{code}" +
    "</Value></Contains></Where></Query><RowLimit>5</RowLimit></View>";
const DemandeList: string = "Lists/DemandeFourniture";
const FournitureList: string = "Lists/Fournitures";

export class FournitureBureauServices {

    @memoize
    public static async  GetArticle(filter: string): Promise<Array<Article>> {
        if (isNaN(parseInt(filter, 10))) {
            return (await SharePointServices.GetItems(articleQuery.replace("{code}", filter + ""), FournitureList))
                .get_data()
                .map(val => {
                    return val.get_fieldValues();
                });
        } else {
            return (await SharePointServices.GetItems(articleCodeQuery.replace("{code}", filter + ""), FournitureList))
                .get_data()
                .map(val => {
                    return val.get_fieldValues();
                });
        }
    }

    public static async GetUserGroups(): Promise<Array<string>> {
        return (await SharePointServices.GetCurrentUserGroups()).get_data().map(grp => grp.get_title());
    }
    public static async GetDemande(id: number): Promise<IDemande> {
        let result: IDemande = helper.GetClassPropertiesOnly(new Demande(),
            (await SharePointServices.GetItemById(DemandeList, id)).get_fieldValues());
        result.Articles = JSON.parse(result.SerializedArticlesFourniture);
        return result;

    }

    public static async Save(item: IDemande, state?: string): Promise<boolean> {
        var itemToUpdate: IDemande = Object.assign({}, item);
        itemToUpdate.SerializedArticlesFourniture = JSON.stringify(item.Articles);
        console.log(itemToUpdate);
        if (state !== undefined) {
            itemToUpdate.StatutDemandeFournitureBureau = state;
        }
        await SharePointServices.AddOrUpdateItem(itemToUpdate, DemandeList);
        return true;
    }

    public static async GetUserDirection(): Promise<{ CodeDirection: string, NameDirection: string }> {
        return SharePointServices.GetCurrentUserDirection();
    }
}