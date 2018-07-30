import React from "react";

export interface IColProps {
    Size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    className?: string;
}

export class Col extends React.Component<IColProps, {}> {
    render(): JSX.Element {
        return <div className={`ms-Grid-col ms-sm${this.props.Size} ms-md${this.props.Size} ms-lg${this.props.Size}
        ${this.props.className!==undefined ? this.props.className:""}`}>
            {this.props.children}
        </div>;
    }
}