import React from "react";
import "../Styles/TextField.css";
import { TextField, BaseComponent, ITextFieldProps } from "office-ui-fabric-react";
import { IComponentProp, IField, IGroupPermissions } from "../../IFieldConfiguration";

export class TextFieldConfiguration implements IField {
    Permissions?: IGroupPermissions[] | undefined;
    Validators: ((value?: any) => string | undefined)[];
    constructor(object: ITextFieldProps) {
        this.Validators = [];
        this.Properties = object;
    }

    public Render: (defaultValue: any, OnChanged: (value: any) => void, disabled?: boolean) => JSX.Element =
        (defaultValue: any, OnChanged: (value: any) => void, disabled?: boolean) => {
            return <TextFieldComponent
                defaultValue={defaultValue}
                prop={this}
                OnChanged={OnChanged}
                disabled={disabled} />;
        }
    Properties: ITextFieldProps;

}

class TextFieldComponent extends BaseComponent<IComponentProp<TextFieldConfiguration>, {}> {

    public render(): JSX.Element {
        return (
            <div>
                <TextField
                    {...this.props.prop.Properties}
                    onGetErrorMessage={this.onGotErrorMessage}
                    onChanged={this.onChanged}
                />
            </div>);
    }
    private IsNullOrWhiteSpace(str?: string): boolean {
        return str === undefined || str === null || str.match(/^ *$/) !== null;
    }
    public onChanged = (newVal: string): void => {

        this.props.OnChanged(newVal);
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
}
