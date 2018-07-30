import { ArticleDemande } from "./ArticleDemande";

export interface IDemande {
  ID: number;
  DateDemandeFournitureBureau?: Date;
  Direction: string;
  CodeDirection: string;
  StatutDemandeFournitureBureau: string;
  SerializedArticlesFourniture: string;
  Articles: Array<ArticleDemande>;
}

export class Demande implements IDemande {
  ID: number = 0;
  DateDemandeFournitureBureau: Date = new Date(Date.now());
  Direction: string = "";
  CodeDirection: string = "";
  StatutDemandeFournitureBureau: string = "";
  SerializedArticlesFourniture: string = "[]";
  Articles: ArticleDemande[] = [];
}