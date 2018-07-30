import React from "react";
import "./Style.css";
export interface IRowProps {
    className?: string;
}

export class Row extends React.Component<IRowProps, {}> {
    render(): JSX.Element {
        return (
            <div className={`ms-Grid-col ms-sm12 ms-md12 ms-lg12 ms-row ${this.props.className !== undefined ? this.props.className : ""}`}>
                {this.props.children}
            </div>);
    }
}