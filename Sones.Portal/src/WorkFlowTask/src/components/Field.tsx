import React from "react";
import { Label } from "office-ui-fabric-react";
import { Row, Col } from "../../../Common.Components/src/Index";
import { IField } from "../models/IField";

export interface IFieldProps extends IField {
    Item: SP.ListItem;
    Field: SP.Field;
}

export class Field extends React.PureComponent<IFieldProps> {
    public render(): JSX.Element {
        return (
            <Row>
                <Col Size={2}><Label> {this.props.Label + " :"} </Label> </Col>
                <Col Size={8}><Label>  {this.GetFormattedValue()}</Label></Col>
            </Row>
        );
    }
    public GetFormattedValue = (): JSX.Element | string => {
        let type: SP.FieldType = this.props.Field.get_fieldTypeKind();
        switch (type) {
            case SP.FieldType.dateTime:
                {
                    let options: any = {};
                    if ((this.props.Field as SP.FieldDateTime).get_displayFormat() !== SP.DateTimeFieldFormatType.dateOnly) {
                        options = {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric"
                        };
                    } else {
                        options = {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",

                        };
                    }
                    return (this.props.Item[this.props.InternalName] as Date).toLocaleDateString("fr-fr", options);
                }
            case SP.FieldType.boolean:
                {
                    return (this.props.Item[this.props.InternalName] as boolean) ? "Oui" : "Non";
                }
            case SP.FieldType.user:
                {
                    return (this.props.Item[this.props.InternalName] as SP.FieldUserValue).get_lookupValue();
                }
            case SP.FieldType.user:
                {
                    return (this.props.Item[this.props.InternalName] as SP.FieldUserValue).get_lookupValue();
                }
            case SP.FieldType.URL:
                {
                    let val: SP.FieldUrlValue = (this.props.Item[this.props.InternalName] as SP.FieldUrlValue);
                    return <a href={val.get_url()}> {val.get_description()}  </a>;
                }
            default:
                return this.props.Item[this.props.InternalName].toString();
        }
    }


}




