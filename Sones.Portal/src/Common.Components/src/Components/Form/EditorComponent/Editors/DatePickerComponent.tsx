import React from "react";
import { IField, IGroupPermissions, IComponentProp } from "../../IFieldConfiguration";
import { IDatePickerProps, IDatePickerStrings, BaseComponent, DatePicker } from "office-ui-fabric-react";
import "../Styles/DatePicker.css";
const DayPickerStrings: IDatePickerStrings = {
    months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    shortMonths: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
    days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
    shortDays: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    goToToday: "Aujourd'hui",
    prevMonthAriaLabel: "Mois précédent",
    nextMonthAriaLabel: "Mois prochain",
    prevYearAriaLabel: "Année précédente",
    nextYearAriaLabel: "Année prochaine",
    isRequiredErrorMessage: "Champ requis.",
    invalidInputErrorMessage: "Format de date incorrect."
};


export class DatePickerConfiguration implements IField {
    public Permissions?: IGroupPermissions[] | undefined;
    public Validators: ((value?: any) => string | undefined)[] = [];
    public Properties: IDatePickerProps;
    public Render = (defaultValue: any, OnChanged: (value: any) => void, disabled?: boolean | undefined): JSX.Element => {
        return <div>
            <DateTimePickerComponent
                defaultValue={defaultValue}
                prop={this}
                OnChanged={OnChanged}
                disabled={disabled} />
        </div>;
    }

    constructor(object: any) {
        this.Properties = object as IDatePickerProps;
        this.Properties.strings = DayPickerStrings;
    }
}

class DateTimePickerComponent extends BaseComponent<IComponentProp<DatePickerConfiguration>, {}> {

    render(): JSX.Element {
        return <div>
            <DatePicker  {...this.props.prop.Properties}
                onSelectDate={this.onChanged}
                formatDate={this.onFormatDate}
            />
        </div>;
    }
    private onFormatDate = (date?: Date): string => {
        if (date !== undefined) {
            return date.toLocaleDateString("fr");
        }
        return "";

    }
    public onChanged = (newVal: any): void => {
        this.props.OnChanged(newVal);
    }
}
