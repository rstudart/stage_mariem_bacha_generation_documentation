import React from "react";

export interface IMSTableCellProps {
    Size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

export class MSTableCell extends React.Component<IMSTableCellProps, {}> {

    render(): JSX.Element {
        return <span className={this.GetClassName()}>{this.props.children}</span>;
    }

    private GetClassName(): string {
        return `ms-Grid-col ms-sm${this.props.Size} ms-md${this.props.Size} ms-lg${this.props.Size} ms-Table-cell`;
    }

}