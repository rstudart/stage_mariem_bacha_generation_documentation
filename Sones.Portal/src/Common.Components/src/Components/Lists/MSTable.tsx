import React from "react";
import "./Styles/MSTable.css";
export class MSTable extends React.Component {
    public render(): JSX.Element {
        return <div className="ms-Table-div">
            <div className="ms-Table">
                {this.props.children}
            </div>
        </div>;
    }
}