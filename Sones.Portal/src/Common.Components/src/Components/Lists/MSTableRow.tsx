
import React from "react";
export interface IMSTableRowProps {
    Header?: boolean;
}

export class MSTableRow extends React.Component<IMSTableRowProps, {}> {
    render(): JSX.Element {
        return <div className={this.RowClass()}>
            {this.props.children}
        </div>;
    }

    private RowClass = (): string => {
        if (this.props.Header !== undefined && this.props.Header) {
            return "ms-Table-row ms-Table-head";
        }
        return "ms-Table-row ms-Table-row-hover";
    }
}

