import { BaseComponent, DatePicker, IBaseProps, DelayedRender, Label } from "office-ui-fabric-react";
import React from "react";
import { DayPickerStrings } from "../../../Common.Services/src/Index";
import { required } from "../../../Common.Components/src/Index";

export interface IDateCommandePickerProps extends IBaseProps {
    onChanged: (Date?: Date) => void;
    Date?: Date;
    Disabled: boolean;
}

export interface IDateCommandePickerState {
    errorMessage: string;
}

export class DateCommandePicker extends BaseComponent<IDateCommandePickerProps, IDateCommandePickerState> {

    constructor(props: IDateCommandePickerProps) {
        super(props);
        this.state = { errorMessage: "" };
    }

    public render(): JSX.Element {
        return <div>
            <Label required> Date de la demande</Label>
            <DatePicker
                className={this.state.errorMessage !== "" ? "invalid" : ""}
                strings={DayPickerStrings}
                onSelectDate={this.onDateChanged}
                value={this.props.Date}
                disabled={this.props.Disabled}
                formatDate={this.onFormatDate} />
            {this.getErrorMessage()}
        </div>;
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


    private onDateChanged = (date: Date | null | undefined): void => {
        if (date === null) {
            date = undefined;
        }
        this.setState({
            errorMessage: required()(date)
        });
        this.props.onChanged(date);
    }

    private onFormatDate = (date?: Date): string => {
        if (date !== undefined) {
            const options: any = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
            return date.toLocaleDateString("fr-fr",options);
        }
        return "";

    }
}