import * as React from "react";
import { ArticleTable } from "./ArticleTable";
import {
    BaseComponent,
    IBaseProps,
} from "office-ui-fabric-react";
import { Article } from "../models/Article";
import { ArticleForm } from "./ArticleForm";



export interface IArticlesProps extends IBaseProps {
    Articles: Array<Article>;
    OnChanged: (articles: Array<Article>) => void;
    Disabled: boolean;
}


export class Articles extends BaseComponent<IArticlesProps, {}> {

    public render(): JSX.Element {
        return <div>
            <ArticleTable Articles={this.props.Articles}
                OnChanged={this.props.OnChanged}
                Disabled={this.props.Disabled}
            />
            {!this.props.Disabled &&
                <ArticleForm Articles={this.props.Articles} key={this.props.Articles.length}
                    OnChanged={this.props.OnChanged} />
            }
        </div >;
    }


}