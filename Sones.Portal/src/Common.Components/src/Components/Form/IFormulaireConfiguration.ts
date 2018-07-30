import { IFormComponentProps } from "./FormComponent";
import { DynamicFieldConfigurationFactroy } from "./EditorComponent/DynamicFieldConfigurationFactroy";

export interface IFormulaireConfiguration {
    Title: string;
    Fields: Array<any>;
    Actions: Array<any>;
    StateColumn?: string;
}
export class Converter {
    public static Convert(val: IFormulaireConfiguration): IFormComponentProps {
        return {
            Title: val.Title,
            Fields: val.Fields.map(elem => {
                return {
                    FieldName: elem.FieldName,
                    FieldConfiguration: DynamicFieldConfigurationFactroy.GetRightClassInstance(elem)
                };
            }),
            Item: {},
            Actions: [],
            State: "",
            UserGroups: []
        };
    }
}