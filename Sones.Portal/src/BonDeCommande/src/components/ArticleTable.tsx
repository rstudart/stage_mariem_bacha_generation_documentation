import { BaseComponent, IBaseProps, IconButton } from "office-ui-fabric-react";
import { Article } from "../models/Article";
import React from "react";
import { MSTable, MSTableRow, MSTableCell } from "../../../Common.Components/src/Index";

export interface IArticleTableProps extends IBaseProps {
    Articles: Array<Article>;
    OnChanged: (articles: Array<Article>) => void;
    Disabled: boolean;
}

export class ArticleTable extends BaseComponent<IArticleTableProps, {}> {

    public render(): JSX.Element {
        return (
            <div className="ms-Table-div">
                <MSTable>
                    <MSTableRow Header>
                        <MSTableCell Size={4} > Designation</MSTableCell>
                        <MSTableCell Size={2} > Quantité</MSTableCell>
                        <MSTableCell Size={2} > Prix Unitaire H.T</MSTableCell>
                        <MSTableCell Size={2} > Montant F. CFA</MSTableCell>
                        <MSTableCell Size={2} > &nbsp;</MSTableCell>
                    </MSTableRow>
                    {
                        this.props.Articles.map((article, index) => {
                            return <MSTableRow key={index} >
                                <MSTableCell Size={4} > {article.Designation}</MSTableCell>
                                <MSTableCell Size={2} > {article.Quantite}</MSTableCell>
                                <MSTableCell Size={2} > {article.PrixUnitaireHT.toLocaleString()}</MSTableCell>
                                <MSTableCell Size={2} > {article.MontantFCFA.toLocaleString()}</MSTableCell>
                                <MSTableCell Size={2} >
                                    {!this.props.Disabled &&
                                        <IconButton
                                            iconProps={{ iconName: "Delete" }}
                                            title="Supprimer"
                                            onClick={() => this.Delete(index)} />
                                    }
                                </MSTableCell>

                            </MSTableRow>;
                        })
                    }
                </MSTable>
            </div>);
    }
    private Delete = (index?: number): void => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ?") && index !== undefined) {
            let articles: Array<Article> = this.props.Articles;
            articles.splice(index, 1);
            this.props.OnChanged(articles);
        }
    }
}