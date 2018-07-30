import { ItemPickerConfiguration } from "./Editors/ItemPickerComponent";
import { ChoiceConfiguration } from "./Editors/ChoiceComponent";
import { TextFieldConfiguration } from "./Editors/TextFieldComponent";
import { IField } from "../IFieldConfiguration";
import * as ValidatorCatalogue from "./Validators/Validators";
import { DatePickerConfiguration } from "./Editors/DatePickerComponent";
import { PeoplePickerConfiguration } from "./Editors/PeoplePickerComponent";


const classes: any = {
    ItemPickerConfiguration,
    ChoiceConfiguration,
    TextFieldConfiguration,
    DatePickerConfiguration,
    PeoplePickerConfiguration
};


export type IValidator = (value?: any) => string | undefined;



export class DynamicFieldConfigurationFactroy {
    public static GetRightClassInstance(object: any): IField {
        let result: IField = new classes[object.Type](object.FieldConfiguration);

        for (let validateur of object.FieldConfiguration.Validators) {
            result.Validators.push(this.GetValidationFucntion(validateur.Name, validateur.Arg));
        }
        return result;
    }
    public static GetValidationFucntion(validationFunctionName: string, validationFunctionArg: any): IValidator {
        return new ValidatorCatalogue[validationFunctionName](validationFunctionArg);
    }
}