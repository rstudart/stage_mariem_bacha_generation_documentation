import React from "react";
import { IComponentProp, IField, IGroupPermissions } from "../../IFieldConfiguration";
import { Dropdown, IDropdownOption, BaseComponent, IDropdownProps } from "office-ui-fabric-react";
import { Services } from "../../../../../../Common.Services/src/Index";

export interface IChoiceComponentState {
    Options: Array<any>;
    SelectedItems: Array<string>;
    SelectedItem: string;
}

export class ChoiceConfiguration implements IField {

    Validators: ((value?: any) => string | undefined)[];
    constructor(object: any) {
        this.Properties = object;
        this.FieldDefinitionChoicesSrc = object.FieldDefinitionChoicesSrc;
        this.ListUrl = object.ListUrl;
        this.Column = object.Column;
        this.Permissions = object.Permissions;
        this.Validators = [];
    }

    Properties: IDropdownProps;

    Permissions?: IGroupPermissions[];
    /** if FieldDefinitionChoicesSrc is false */
    /** get choices from field definition */
    FieldDefinitionChoicesSrc: boolean = false;
    ListUrl?: string = "";
    Column?: string = "";
    public Render: (defaultValue: any, OnChanged: (value: any) => void, disabled?: boolean) => JSX.Element =
        (defaultValue: any, OnChanged: (value: any) => void, disabled?: boolean) => {
            return <ChoiceComponent
                defaultValue={defaultValue}
                prop={this}
                OnChanged={OnChanged}
                disabled={disabled} />;
        }
}

class ChoiceComponent extends BaseComponent<IComponentProp<ChoiceConfiguration>, IChoiceComponentState> {
    constructor(props: any) {
        super(props);
        if (!this.props.prop.FieldDefinitionChoicesSrc) {
            if (this.props.prop.Properties.options !== undefined) {
                this.state = {
                    Options: this.props.prop.Properties.options,
                    SelectedItems: (this.props.defaultValue === undefined)
                        ? new Array<string>() : (this.props.defaultValue as Array<string>),
                    SelectedItem: (this.props.defaultValue === undefined) ? "" : this.props.defaultValue as string
                };
            }
        } else {
            this.state = {
                Options: new Array(),
                SelectedItem: (this.props.defaultValue === undefined) ? "" : this.props.defaultValue as string,
                SelectedItems: (this.props.defaultValue === undefined) ? new Array<string>() : (this.props.defaultValue as Array<string>)
            };
            if (this.props.prop.ListUrl !== undefined && this.props.prop.Column !== undefined) {
                Services.GetChoices(this.props.prop.ListUrl, this.props.prop.Column)
                    .then(result => this.setState({ Options: result }));
            }
        }
    }
    private GetOptions = (): Array<any> => {
        return this.state.Options.map(op => { return { key: op, text: op }; });
    }
    public render(): JSX.Element {
        return (
            <div>
                <Dropdown
                    {...this.props.prop.Properties}
                    defaultSelectedKeys={this.props.defaultValue}
                    defaultValue={this.props.defaultValue}
                    disabled={this.props.disabled}
                    errorMessage={this.GetErrorMessage()}
                    options={this.GetOptions()}
                    onChanged={this.onChange}
                />

            </div>
        );
    }
    private onChangeMultiSelect = (item: IDropdownOption): void => {
        let updatedSelectedItem: Array<string> = this.state.SelectedItems;
        if (item.selected) {
            updatedSelectedItem.push(item.key.toString());
        } else {
            let currIndex: number = updatedSelectedItem.indexOf(item.key.toString());
            if (currIndex > -1) {
                updatedSelectedItem.splice(currIndex, 1);
            }
        }
        this.setState({ SelectedItems: updatedSelectedItem });

        this.props.OnChanged(updatedSelectedItem);
    }
    private onChange = (item: IDropdownOption): void => {
        if (this.props.prop.Properties.multiSelect === undefined || !this.props.prop.Properties.multiSelect) {
            this.onchangeOneSelect(item);
        } else {
            this.onChangeMultiSelect(item);
        }
    }
    private onchangeOneSelect = (item: IDropdownOption): void => {
        this.setState({ SelectedItem: item.key.toString() });
        this.props.OnChanged(item.key.toString());

    }
    private GetErrorMessage = (): string => {
        if (this.props.prop.Properties.required && this.state.SelectedItem.length === 0) {
            return "Ce champs est obligatoire";
        } return "";

    }
}