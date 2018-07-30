import { BaseComponent, IBaseProps, IconButton, TextField } from "office-ui-fabric-react";
import React from "react";
import { MSTable, MSTableRow, MSTableCell, required, isInteger } from "../../../Common.Components/src/Index";
import { ArticleDemande } from "../models/ArticleDemande";

export interface IArticleTableProps extends IBaseProps {
    Articles: Array<ArticleDemande>;
    OnChanged: (articles: Array<ArticleDemande>) => void;
    ShowEdit: boolean;
    Disabled: boolean;
}

export class ArticleTable extends BaseComponent<IArticleTableProps, {}> {

    public render(): JSX.Element {
        return (
            <div className="ms-Table-div">
                <MSTable>
                    <MSTableRow Header>
                        <MSTableCell Size={this.GetSize()}> Code article </MSTableCell>
                        <MSTableCell Size={this.GetSize()}> Article </MSTableCell>
                        <MSTableCell Size={this.GetSize()}> Quantité demandée </MSTableCell>
                        {this.props.ShowEdit &&
                            <MSTableCell Size={2}> Quantité Livrée </MSTableCell>
                        }
                        {this.props.ShowEdit &&
                            <MSTableCell Size={4}> Observation </MSTableCell>
                        }
                        {!this.props.ShowEdit &&
                            <MSTableCell Size={3}> &nbsp; </MSTableCell>
                        }
                    </MSTableRow>
                    {
                        this.props.Articles.map((article, index) => {
                            return (
                                <MSTableRow key={index}>
                                    <MSTableCell Size={this.GetSize()}> {article.CodeArticle} </MSTableCell>
                                    <MSTableCell Size={this.GetSize()}> {article.Article} </MSTableCell>
                                    <MSTableCell Size={this.GetSize()}> {article.QuantiteDemandee} </MSTableCell>
                                    {this.props.ShowEdit &&
                                        <MSTableCell Size={2}>
                                            <TextField
                                                validateOnFocusOut={true}
                                                validateOnLoad={false}
                                                onChanged={(value: number) => {
                                                    article.QuantiteLivree = value;
                                                }}
                                                value={article.QuantiteLivree + ""}
                                                placeholder="Quantité livrée"
                                                onGetErrorMessage={this.onQuantiteGetErrorMessage}
                                            />
                                        </MSTableCell>
                                    }
                                    {this.props.ShowEdit &&
                                        <MSTableCell Size={4}>
                                            <TextField
                                                validateOnFocusOut={true}
                                                validateOnLoad={false}
                                                multiline
                                                value={article.Observation}
                                                onChanged={(value) => {
                                                    article.Observation = value;
                                                }}
                                            />
                                        </MSTableCell>
                                    }
                                    {!this.props.ShowEdit &&
                                        <MSTableCell Size={3}>
                                            {!this.props.Disabled &&
                                                <IconButton
                                                    iconProps={{ iconName: "Delete" }}
                                                    title="Supprimer"
                                                    onClick={() => this.DeleteArticle(index)} />
                                            }
                                        </MSTableCell>
                                    }
                                </MSTableRow>);
                        })
                    }
                </MSTable>
            </div>);
    }

    private onQuantiteGetErrorMessage = (newValue: string): string => {
        let message: string = required()(newValue);
        if (message === "") {
            message = isInteger()(newValue);
            if (message === "") {
                if (parseFloat(newValue) <= 0) {
                    message = "La valeur doit être strictement positive";
                }
            }
        }
        return message;
    }

    private GetSize = (): 2 | 3 => {
        return this.props.ShowEdit ? 2 : 3;
    }

    private DeleteArticle = (index: number): void => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ?") && index !== undefined) {
            let articles: Array<ArticleDemande> = this.props.Articles;
            articles.splice(index, 1);
            this.props.OnChanged(articles);
        }
    }
}