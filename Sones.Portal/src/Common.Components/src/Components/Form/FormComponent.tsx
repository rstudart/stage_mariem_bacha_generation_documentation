import React from "react";
import { IFieldSettings, IFormAction } from "./IFieldConfiguration";
import { Field } from "./EditorComponent/Field";
import { ActionButton } from "./ActionComponent/ActionButton";
import { BaseComponent, IBaseProps } from "office-ui-fabric-react";

export interface IFormComponentProps extends IBaseProps {
    Title: string;
    Fields: Array<IFieldSettings>;
    Actions: Array<IFormAction>;
    Item: any;
    UserGroups: Array<string>;
    State: string;
}



export class FormComponent extends BaseComponent<IFormComponentProps, {}> {

    public render(): JSX.Element {

        return (
            <div className="ms-Grid">
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                        <span className="ms-fontSize-xxl">{this.props.Title}</span>
                    </div>
                </div>
                {
                    this.props.Fields.map(value => {
                        return <Field Config={value}
                            key={value.FieldName}
                            OnChanged={(val: any) => this.OnFieldValueChanged(value.FieldName, val)}
                            DefaultValue={this.props.Item[value.FieldName]}
                            UserGroups={this.props.UserGroups}
                            State={this.props.State} />;
                    })
                }
                {this.props.children}
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                        {
                            this.props.Actions.map(value => {
                                return <ActionButton Config={value}
                                    UserGroups={this.props.UserGroups}
                                    State={this.props.State}
                                />;
                            })}
                    </div>

                </div>
            </div>
        );
    }
    private OnFieldValueChanged = (fieldName: string, value: any): void => {
        this.props.Item[fieldName] = value;
    }
}
