import * as Mustache from "mustache";
import React from "react";
import ReactDOM from "react-dom";
import { PrintArea } from "./PrintArea";

export class PrintHandler {

    public static Print(template: string, data: any): void {

        let newObject: any = { ...data };
        newObject.FormatNumber = PrintHandler.FormatNumber;
        let templateToPrint: string = Mustache.render(template, newObject);
        PrintHandler.printHtml(templateToPrint);
    }
    private static FormatNumber = (): any => {
        return (text: any, render: Function) => {
            return parseFloat(render(text)).toLocaleString();
        };
    }
    private static printHtml(html: string): void {
        var container :HTMLDivElement = document.body.appendChild(document.createElement("div"));
        ReactDOM.render(<PrintArea Html={html} SelfDestroy={() => container.remove()} />, container);
    }
}