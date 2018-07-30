import { BaseComponent, IBaseProps, ITag, TagPicker, DelayedRender } from "office-ui-fabric-react";
import { Article } from "../models/Article";
import React from "react";
import { FournitureBureauServices } from "../Services/FournitureBureauServices";
import { required } from "../../../Common.Components/src/Index";

export interface IArticlePickerProps extends IBaseProps {
    onChanged: (article?: Article) => void;
}

export interface IArticlePickerState extends IBaseProps {
    selectedItem?: ITag;
    errorMessage: string;
}

export class ArticlePicker extends BaseComponent<IArticlePickerProps, IArticlePickerState> {
    constructor(props: IArticlePickerProps) {
        super(props);
        this.state = {
            errorMessage: ""
        };
    }

    public render(): JSX.Element {
        return <div>
            <TagPicker
                className={"ms-sm12 ms-md12 ms-lg12 " + (this.state.errorMessage !== "" ? "invalid" : "")}
                selectedItems={this.selectedItems()}
                getTextFromItem={(item: ITag) => { return item.name; }}
                pickerSuggestionsProps={{
                    suggestionsHeaderText: "Suggestions",
                    noResultsFoundText: "Aucun resultat"
                }}
                onChange={this.onChange}
                itemLimit={1}
                inputProps={{
                    onBlur: this.validate,
                    placeholder: "Article"
                }}
                onResolveSuggestions={this.onResolveSuggestions}
                onRenderSuggestionsItem={this.onRenderSuggestionsItem} />
            {this.getErrorMessage()}
        </div>;
    }
    private onChange = (items?: ITag[]): void => {
        if (items === undefined || items.length === 0) {
            this.setState({
                errorMessage: "",
                selectedItem: undefined
            });
            this.props.onChanged(undefined);
        } else {
            this.setState({
                errorMessage: "",
                selectedItem: items[0]
            });
            this.props.onChanged({
                CodeArticleFournitureBureau: parseInt(items[0].key, 10),
                ArticleFournitureBureau: items[0].name
            });

        }
    }
    private getErrorMessage = (): JSX.Element => {
        if (!this.IsNullOrWhiteSpace(this.state.errorMessage)) {
            return <div aria-live="assertive">
                <DelayedRender>
                    <span className="ms-TextField-errorMessage css-43">
                        <span data-automation-id="error-message" className="errormessage">
                            {this.state.errorMessage}
                        </span>
                    </span>
                </DelayedRender>
            </div>;
        } else {
            return <div></div>;
        }
    }

    private IsNullOrWhiteSpace(str?: string): boolean {
        return str === undefined || str === null || str.match(/^ *$/) !== null;
    }

    private onRenderSuggestionsItem = (props: ITag, _itemProps: any): JSX.Element => {
        return <div className="sug-item">
            <strong>Article :</strong>{props.name}
            <br />
            <strong>Code article :</strong>{props.key}
        </div >;
    }

    private onResolveSuggestions = async (_filter: string, _selectedItems?: ITag[]): Promise<ITag[]> => {
        try {
            return (await FournitureBureauServices.GetArticle(_filter)).map(item => {
                return {
                    key: item.CodeArticleFournitureBureau + "",
                    name: item.ArticleFournitureBureau
                } as ITag;
            });
        } catch (e) {
            console.log(e);
            return [];
        }

    }

    public validate = (): void => {
        if (this.state.selectedItem === undefined) {
            this.setState({
                errorMessage: required()()
            });
        } else {
            this.setState({
                errorMessage: ""
            });
        }
    }

    private selectedItems = (): Array<ITag> => {
        if (this.state.selectedItem === undefined) {
            return [];
        } else {
            return [this.state.selectedItem];
        }
    }

}