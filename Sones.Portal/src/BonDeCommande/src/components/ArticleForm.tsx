import { Article } from "../models/Article";
import * as React from "react";
import { TextField, BaseComponent, IBaseProps, DefaultButton } from "office-ui-fabric-react";
import { required, isInteger, isNumber, Col, Row } from "../../../Common.Components/src/Index";

export interface IAricleFormProp extends IBaseProps {
    Articles: Array<Article>;
    OnChanged: (articles: Array<Article>) => void;
}
export interface IArticleFormState {
    Article: Article;
}

export class ArticleForm extends BaseComponent<IAricleFormProp, IArticleFormState> {
    constructor(props: IAricleFormProp) {
        super(props);
        this.state = {
            Article: new Article()
        };
    }

    public render(): JSX.Element {
        return <Row className="article-form">
            <Col Size={4}>
                <TextField
                    required={true}
                    validateOnFocusOut={true}
                    validateOnLoad={false}
                    placeholder="Désignation"
                    onGetErrorMessage={this.ValidateDesignation}
                    onChanged={(newValue: string) => {
                        let state: IArticleFormState = this.state;
                        state.Article.Designation = newValue;
                        this.setState(state);
                    }}
                    value={this.state.Article.Designation} />
            </Col>
            <Col Size={2}>
                <TextField
                    required={true}
                    placeholder="Quantité"
                    validateOnFocusOut={true}
                    validateOnLoad={false}
                    onChanged={(newValue: number) => {
                        let state: IArticleFormState = this.state;
                        state.Article.Quantite = newValue;
                        this.setState(state);
                    }}
                    onGetErrorMessage={this.ValidateQuantite}
                    value={this.state.Article.Quantite.toString()} />
            </Col >
            <Col Size={2}>
                <TextField
                    required={true}
                    placeholder="Prix unitaire HT"
                    validateOnFocusOut={true}
                    validateOnLoad={false}
                    onChanged={(newValue: number) => {
                        let state: IArticleFormState = this.state;
                        state.Article.PrixUnitaireHT = newValue;
                        this.setState(state);
                    }}
                    value={this.state.Article.PrixUnitaireHT.toString()}
                    onGetErrorMessage={this.ValidatePrixHT} />
            </Col >
            <Col Size={2}></Col >
            <Col Size={2}>
                <div>

                    <DefaultButton
                        text="Ajouter"
                        title="Ajouter un article"
                        iconProps={{ iconName: "Add" }}
                        disabled={this.IsSaveDisabled()}
                        onClick={this.SaveArticle} />
                </div>
            </Col >
        </Row>;
    }
    private IsSaveDisabled = (): boolean => {
        return (
            this.ValidateDesignation(this.state.Article.Designation) !== "" ||
            this.ValidatePrixHT(this.state.Article.PrixUnitaireHT.toString()) !== "" ||
            this.ValidateQuantite(this.state.Article.Quantite.toString()) !== ""
        );
    }

    private SaveArticle = (): void => {
        let articles: Array<Article> = this.props.Articles;

        this.setState({ Article: new Article() });
        let result: Article = new Article();
        result.Designation = this.state.Article.Designation;
        result.PrixUnitaireHT = parseFloat(this.state.Article.PrixUnitaireHT + "");
        result.Quantite = parseInt(this.state.Article.Quantite + "", 10);
        result.MontantFCFA = (result.PrixUnitaireHT * 1000 * result.Quantite) / 1000;
        articles.push(result);
        this.props.OnChanged(articles);
    }

    private ValidateDesignation = (newValue: string): string => {
        return required()(newValue);
    }

    private ValidatePrixHT = (newValue: string): string => {
        let message: string = required()(newValue);
        if (message === "") {
            message = isNumber()(newValue); if (message === "") {
                if (parseFloat(newValue) <= 0) {
                    message = "La valeur doit être strictement positive";
                }
            }
        }
        return message;
    }
    private ValidateQuantite = (newValue: string): string => {
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
}