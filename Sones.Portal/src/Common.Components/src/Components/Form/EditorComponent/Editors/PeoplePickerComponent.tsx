
import {
    IBasePickerSuggestionsProps,
    IPersonaProps,
    NormalPeoplePicker,
    BaseComponent,
    DelayedRender,
    Label
} from "office-ui-fabric-react";
import { IGroupPermissions, IField, IComponentProp } from "../../IFieldConfiguration";
import React from "react";
import { Services } from "../../../../../../Common.Services/src/Index";
import "../Styles/PeoplePicker.css";
import "../Styles/ErrorStyle.css";
const suggestionProps: IBasePickerSuggestionsProps = {
    suggestionsHeaderText: "Personnes suggérées",
    noResultsFoundText: "Aucun résultat trouvé",
    loadingText: "Chargement"
};

export class PeoplePickerConfiguration implements IField {
    Permissions?: IGroupPermissions[] | undefined;
    Validators: ((value?: any) => string | undefined)[];
    constructor(object: any) {
        this.Validators = [];
        this.label = object.label;
        this.required = object.label;
        this.Properties = object;
        this.Properties.label = "";
    }

    public Render: (defaultValue: any, OnChanged: (value: any) => void, disabled?: boolean) => JSX.Element =
        (defaultValue: any, OnChanged: (value: any) => void, disabled?: boolean) => {
            return <div>
                <PeoplePickerComponent
                    defaultValue={defaultValue}
                    prop={this}
                    OnChanged={OnChanged}
                    disabled={disabled} />
            </div>;
        }
    Properties: any;
    label: string;
    required: boolean;
    GroupeName?: string;
}

interface IPeoplePickerComponentState {
    errorMessage: string;
}

class PeoplePickerComponent extends BaseComponent<IComponentProp<PeoplePickerConfiguration>, IPeoplePickerComponentState> {


    constructor(props: IComponentProp<PeoplePickerConfiguration>) {
        super(props);
        this.state = { errorMessage: this.onGotErrorMessage(props.defaultValue) };
        this.Initialize(props.defaultValue);
    }

    public render(): JSX.Element {
        return (
            <div>
                <Label required={this.props.prop.required} >{this.props.prop.label} </Label>
                <NormalPeoplePicker
                    {...this.props.prop.Properties}
                    selectedItems={this.props.defaultValue}
                    pickerSuggestionsProps={suggestionProps}
                    onChange={this.onChange}
                    onResolveSuggestions={this.onResolveSuggestions} />
                {this.getErrorMessage()}

            </div>);
    }

    private onGotErrorMessage = (value: any): string => {
        let result: string = "";
        this.props.prop.Validators.forEach(element => {

            let message: string | undefined = element(value);
            if (!this.IsNullOrWhiteSpace(message)) {
                result += message + "\n";
            }
        });
        return result;
    }

    private getErrorMessage = (): JSX.Element => {
        if (!this.IsNullOrWhiteSpace(this.state.errorMessage)) {
            return <div aria-live="assertive">
                <DelayedRender>
                    <p className="ms-TextField-errorMessage css-43">
                        <span data-automation-id="error-message" className="errormessage">
                            {this.state.errorMessage}
                        </span>
                    </p>
                </DelayedRender>
            </div>;
        } else {
            return <div></div>;
        }

    }

    private IsNullOrWhiteSpace(str?: string): boolean {
        return str === undefined || str === null || str.match(/^ *$/) !== null;
    }

    private onChange = (items?: IPersonaProps[]): void => {
        if (items !== undefined) {
            this.props.OnChanged(items.map(item => item.id));
        } else {
            this.props.OnChanged([]);
        }
        this.setState({ errorMessage: this.onGotErrorMessage(items) });
    }

    private Initialize = async (val: Array<number>): Promise<void> => {
        let initialPeople: Array<IPersonaProps> = new Array<IPersonaProps>();
        for (let id of val) {
            let user: any = await Services.GetUserById(id);
            initialPeople.push({
                Id: user.Id,
                primaryText: user.FullName,
                secondaryText: user.Email,
                imageUrl: user.ImageUrl,
            } as IPersonaProps);
        }

    }

    private onResolveSuggestions = async (filter: string, _selectedItems?: Array<IPersonaProps>):
        Promise<Array<IPersonaProps> | PromiseLike<Array<IPersonaProps>>> => {
        return (await Services.SearchUser(filter, this.props.prop.GroupeName)).map(value => {
            return {
                Id: value.Id,
                primaryText: value.FullName,
                secondaryText: value.Email,
                imageUrl: value.ImageUrl,
            } as IPersonaProps;
        });
    }

}
