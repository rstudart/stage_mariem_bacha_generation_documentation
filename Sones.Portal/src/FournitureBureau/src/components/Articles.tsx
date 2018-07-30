import { BaseComponent, IBaseProps } from "office-ui-fabric-react";
import React from "react";
import { ArticleTable } from "./ArticleTable";
import { ArticleForm } from "./ArticleForm";
import { ArticleDemande } from "../models/ArticleDemande";
export interface IArticlesProps extends IBaseProps {
    OnChanged: (array: Array<ArticleDemande>) => void;
    Articles: Array<ArticleDemande>;
    ShowEdit: boolean;
    Disabled: boolean;
}

export class Articles extends BaseComponent<IArticlesProps, {}> {

    public render(): JSX.Element {
        return <div>
            <ArticleTable OnChanged={this.props.OnChanged}
                Articles={this.props.Articles}
                Disabled={this.props.Disabled}
                ShowEdit={this.props.ShowEdit} />
            {!this.props.ShowEdit && !this.props.Disabled &&
                < ArticleForm key={this.props.Articles.length}
                    OnChanged={this.props.OnChanged}
                    Articles={this.props.Articles} />
            }
        </div>;
    }
}