import { IComponentProp, IField, IGroupPermissions } from "../../IFieldConfiguration";
import React from "react";
import { TagPicker, ITag, Label, BaseComponent, ITagPickerProps } from "office-ui-fabric-react";
import { Services } from "../../../../../../Common.Services/src/Index";

export class ItemPickerConfiguration implements IField {
    Permissions?: IGroupPermissions[] | undefined;
    Validators: ((value?: any) => string | undefined)[];
    constructor(object: any) {
        this.Properties = object;
        this.label = object.label;
        this.required = object.required;
        this.ListUrl = object.ListUrl;
        this.DisplayedColumn = object.DisplayedColumn;
        this.Validators = [];

    }
    label: string;
    required?: boolean;
    Properties: ITagPickerProps;
    ListUrl: string = "";
    DisplayedColumn: string = "";

    public Render: (defaultValue: any, OnChanged: (value: any) => void, disabled?: boolean) => JSX.Element =
        (defaultValue: any, OnChanged: (value: any) => void, disabled?: boolean) => {
            return <ItemPickerComponent
                defaultValue={defaultValue}
                prop={this}
                OnChanged={OnChanged}
                disabled={disabled} />;
        }
}

class ItemPickerComponent extends BaseComponent<IComponentProp<ItemPickerConfiguration>, {}> {

    public render(): JSX.Element {
        return (<div>
            <Label required={this.props.prop.required}>{this.props.prop.label}</Label>
            <TagPicker
                {...this.props.prop.Properties}
                getTextFromItem={(item: ITag) => { return item.name; }}
                pickerSuggestionsProps={{
                    suggestionsHeaderText: "Suggestions",
                    noResultsFoundText: "Aucun resultat"
                }}
                disabled={this.props.disabled}
                onChange={this.OnChange}
                onResolveSuggestions={this.onResolveSuggestions}
            />
        </div>);
    }

    private onResolveSuggestions = (filterText: string): ITag[] | Promise<Array<ITag>> => {
        return (Services.GetItems(filterText,  this.props.prop.ListUrl))
            .then(r => {
                return (r as Array<any>).map<ITag>(item => {
                    return {
                        key: item.ID,
                        name: item[this.props.prop.DisplayedColumn]
                    };
                }
                );
            });
    }

    private OnChange = (items?: Array<ITag>): void => {
        if (items !== undefined) {
            this.props.OnChanged(items.map(item => item.key));
        } else {
            this.props.OnChanged([]);
        }

    }
}