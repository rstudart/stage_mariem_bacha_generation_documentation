import { BaseComponent, TextField, DefaultButton, IBaseProps } from "office-ui-fabric-react";
import { ArticlePicker } from "./ArticlePicker";
import React from "react";
import { ArticleDemande } from "../models/ArticleDemande";
import { Article } from "../models/Article";
import { Row, Col, isInteger, required } from "../../../Common.Components/src/Index";

export interface IArticleFormState extends ArticleDemande {
}
export interface IArticleFormProps extends IBaseProps {
    OnChanged: (articles: Array<ArticleDemande>) => void;
    Articles: Array<ArticleDemande>;
}


export class ArticleForm extends BaseComponent<IArticleFormProps, IArticleFormState> {

    constructor(props: IArticleFormProps) {
        super(props);
        this.state = new ArticleDemande();
    }

    public render(): JSX.Element {
        return (
            <Row>
                <Col Size={6}>
                    <ArticlePicker onChanged={this.onArticleChanged} />
                </Col>
                <Col Size={4}>
                    <TextField
                        validateOnFocusOut={true}
                        validateOnLoad={false}
                        onChanged={this.onQuantiteChanged}
                        placeholder="Quantité  demandée"
                        onGetErrorMessage={this.onQuantiteGetErrorMessage}
                    />
                </Col>
                <Col Size={2}>
                    <DefaultButton
                        text="Ajouter"
                        title="Ajouter un article"
                        iconProps={{ iconName: "Add" }}
                        disabled={this.IsSaveDisabled()}
                        onClick={this.SaveArticle} />
                </Col>
            </Row>);
    }

    private IsSaveDisabled = (): boolean => {
        return !(this.state.Article !== "" &&
            this.state.CodeArticle !== 0 &&
            this.state.QuantiteDemandee > 0);
    }
    private onQuantiteChanged = (qte: number): void => {
        this.setState({ QuantiteDemandee: qte });
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

    private onArticleChanged = (article?: Article): void => {
        if (article === undefined) {
            this.setState({
                Article: "",
                CodeArticle: 0
            });
        } else {
            this.setState({
                Article: article.ArticleFournitureBureau,
                CodeArticle: article.CodeArticleFournitureBureau
            });
        }
    }
    private SaveArticle = (): void => {
        let articles: Array<ArticleDemande> = this.props.Articles;
        articles.push(this.state);
        this.props.OnChanged(articles);
    }
}