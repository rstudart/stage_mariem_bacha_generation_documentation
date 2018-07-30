import { Services } from "../../../../Common.Services/src/Index";
import { FormComponent, IFormComponentProps } from "./FormComponent";
import { IFormulaireConfiguration, Converter } from "./IFormulaireConfiguration";
import ReactDOM from "react-dom";
import React from "react";

export class FormRender {

    static async  Render(Item: any, StateColum?: string): Promise<void> {
        var urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        let configListUrl: string = urlParams.has("ConfigListUrl") ?
            urlParams.get("ConfigListUrl") as string : "";
        let Id: string = urlParams.has("ID") ?
            urlParams.get("ID") as string : "";
        let config: IFormulaireConfiguration = await Services.GetItemByID(configListUrl, Id);
        let FormProp: IFormComponentProps = Converter.Convert(config);

        FormProp.UserGroups = await Services.GetCurrentUserGroups();
        FormProp.Item = Item;
        if (StateColum !== undefined) {
            FormProp.State = Item[StateColum];
        }
        ReactDOM.render(<FormComponent {...FormProp} />, document.getElementById("app")
        );
    }

}