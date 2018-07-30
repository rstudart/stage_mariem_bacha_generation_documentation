import React from "react";

// tslint:disable-next-line:max-line-length
const printStyle: string = `@media screen{#print-area{display: none;}}@media print{body *{visibility: hidden;}#print-area, #print-area *{visibility: visible;}#print-area{position: absolute; left: 0; top: 0;}}`;

export interface IPrintAreaProps { Html: string; SelfDestroy: () => void; }
export class PrintArea extends React.Component<IPrintAreaProps, {}> {
    componentDidMount(): void {
        {
            window.print();
            setTimeout(() => { this.props.SelfDestroy(); });
        }
    }
    render(): JSX.Element {
        return <div>
            <style type="text/css" dangerouslySetInnerHTML={{ __html: printStyle }} />
            <div id="print-area" dangerouslySetInnerHTML={{ __html: this.props.Html }}></div>
        </div >;
    }
}

