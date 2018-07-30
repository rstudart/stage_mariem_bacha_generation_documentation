import { Article } from "./Article";

export interface ICommande {
  ID: number;
  NumeroBonDeCommande: string;
  DateBonDeCommande?: Date;
  DA: string;
  Fournisseur?: string;
  FournisseurID?: string;
  Remarque: string;
  Articles: Array<Article>;
  SerializedArticlesBonDeCommande: string;
  MontantHTVA: number;
  MontantTTC: number;
  MontantEnLettres: string;
  TVA: number;
  TotalTVA: number;
  StatutBonDeCommande: string;
  File: File | null;
  ScannedAttachements: Array<string>;

}

export class Commande implements ICommande {
  ScannedAttachements: string[]=[];
  File: File | null = null;
  ID: number = 0;
  NumeroBonDeCommande: string = "";
  DateBonDeCommande?: Date | undefined = undefined;
  DA: string = "";
  Fournisseur?: string | undefined = undefined;
  FournisseurID?: string | undefined = undefined;
  Remarque: string = "";
  Articles: Article[] = [];
  SerializedArticlesBonDeCommande: string = "";
  MontantHTVA: number = 0;
  MontantTTC: number = 0;
  MontantEnLettres: string = "";
  TVA: number = 0;
  TotalTVA: number = 0;
  StatutBonDeCommande: string = "";
}