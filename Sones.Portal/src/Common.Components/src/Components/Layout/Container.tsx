import React from "react";

export class Container extends React.Component {
    render(): JSX.Element {
        return <div className="ms-Grid">
            {this.props.children}
        </div>;
    }
}