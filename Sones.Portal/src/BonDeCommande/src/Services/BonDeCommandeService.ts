import { ICommande, Commande } from "../models/ICommande";
import { Fournisseur } from "../models/Fournisseur";
import { SharePointServices, helper } from "../../../Common.Services/src/Index";
import { memoize } from "office-ui-fabric-react";
const fournisseurQuery: string
    = "<View><Query><Where><Contains><FieldRef Name='FournisseurName' /><Value Type='Text'>{Name}" +
    "</Value></Contains></Where></Query><RowLimit>5</RowLimit></View>";
const BonDeCommandeListUrl: string = "Lists/BonDeCommande";
const FournisseursListUrl: string = "Lists/Fournisseurs";

export class BonDeCommandeService {

    @memoize
    public static async  GetFournisseurByName(name: string): Promise<Array<Fournisseur>> {
        let result: SP.ListItemCollection =
            await SharePointServices.GetItems(fournisseurQuery.replace("{Name}", name), FournisseursListUrl);
        return result.get_data().map(val => {
            return val.get_fieldValues();
        });
    }

    @memoize
    public static async  GetFournisseurByID(id: number): Promise<Fournisseur> {
        let result: SP.ListItem =
            await SharePointServices.GetItemById(FournisseursListUrl, id);
        return result.get_fieldValues();
    }
    @memoize
    public static async GetCommande(id: number): Promise<ICommande> {
        let result: ICommande = helper.GetClassPropertiesOnly(new Commande(),
            (await SharePointServices.GetItemById(BonDeCommandeListUrl, id)).get_fieldValues());
        result.Articles = JSON.parse(result.SerializedArticlesBonDeCommande);
        result.ScannedAttachements = await SharePointServices.GetAttatchementsUrls(BonDeCommandeListUrl, id);
        return result;
    }

    public static async GetUserGroups(): Promise<Array<string>> {
        return (await SharePointServices.GetCurrentUserGroups()).get_data().map(grp => grp.get_title());
    }
    @memoize
    public static async GetPrintTemplate(): Promise<string> {
        return SharePointServices.GetTemplate("BonDeCommande");
    }

    public static async AddOrUpdate(commande: ICommande, state: string): Promise<boolean> {
        commande.SerializedArticlesBonDeCommande = JSON.stringify(commande.Articles);
        commande.StatutBonDeCommande = state;
        let id: number = await SharePointServices.AddOrUpdateItem(commande, BonDeCommandeListUrl);
        if (commande.File !== null && commande.File !== undefined) {
            await SharePointServices.AttachFileToItem(BonDeCommandeListUrl, id, commande.File as File);
            return true;
        }
        return false;
    }
}