import { BaseComponent, TagPicker, Label, ITag, IBaseProps, DelayedRender } from "office-ui-fabric-react";
import React from "react";
import { required } from "../../../Common.Components/src/Index";
import { BonDeCommandeService } from "../Services/BonDeCommandeService";
export interface IFournisseurState {
    selectedItem?: ITag;
    errorMessage: string;
}

export interface IFournisseurProps extends IBaseProps {
    FournisseurName?: string;
    FournisseurID?: string;
    Disabled: boolean;
    onChange: (id?: string, name?: string) => void;
}
export class FournisseurPicker extends BaseComponent<IFournisseurProps, IFournisseurState> {

    constructor(props: IFournisseurProps) {
        super(props);
        this.state = {
            errorMessage: "",
            selectedItem: (props.FournisseurID === undefined) ? undefined : ({
                name: props.FournisseurName, key: props.FournisseurID
            } as ITag),
        };

        this.componentWillReceiveProps = (props) => {
            this.setState({
                selectedItem: (props.FournisseurID === undefined) ? undefined : ({
                    name: props.FournisseurName, key: props.FournisseurID
                } as ITag),
            });
        };
    }

    render(): JSX.Element {
        return <div>
            <Label required={true}>Fournisseur</Label>
            <TagPicker
                className={"ms-sm12 ms-md12 ms-lg12 " + (this.state.errorMessage !== "" ? "invalid" : "")}
                selectedItems={this.selectedItems()}
                getTextFromItem={(item: ITag) => { return item.name; }}
                disabled={this.props.Disabled}
                pickerSuggestionsProps={{
                    suggestionsHeaderText: "Suggestions",
                    noResultsFoundText: "Aucun resultat"
                }}
                onRenderSuggestionsItem={this.onRenderSuggestionsItem}
                inputProps={{
                    onBlur: this.validate
                }}

                onChange={this.onChange}
                itemLimit={1}
                onResolveSuggestions={this.onResolveSuggestions}
            />
            {this.getErrorMessage()}
        </div>;
    }
    private onRenderSuggestionsItem = (props: any, _itemProps: any): JSX.Element => {

        return <div className="sug-item">
            <strong>Nom :</strong> {props.name}
            <br />
            <strong>Adresse :</strong> {props.address}
            <br />
            <strong>Téléphone :</strong> {props.phone}
        </div >;
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

    private onChange = (items?: ITag[]): void => {
        if (items === undefined || items.length === 0) {
            this.setState({
                errorMessage: "",
                selectedItem: undefined
            });
            this.props.onChange(undefined);
        } else {
            this.setState({
                errorMessage: "",
                selectedItem: items[0]
            });
            this.props.onChange(items[0].key, items[0].name);
        }
    }

    private selectedItems = (): Array<ITag> => {
        if (this.state.selectedItem === undefined) {
            return [];
        } else {
            return [this.state.selectedItem];
        }
    }

    private onResolveSuggestions = async (_filter: string, _selectedItems?: ITag[]): Promise<ITag[]> => {
        try {
            return (await BonDeCommandeService.GetFournisseurByName(_filter)).map(item => {
                return {
                    key: item.ID,
                    name: item.FournisseurName,
                    address: item.FournisseurAddress,
                    phone: item.FournisseurPhone
                } as ITag;
            });
        } catch (e) {
            console.log(e);
            return [];
        }

    }

}